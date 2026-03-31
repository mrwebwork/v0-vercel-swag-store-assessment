'use server'

import 'server-only'
import { cookies } from 'next/headers'
import { createCart, addToCart, updateCartItem, removeCartItem, getCart, fetchProductStock } from './api'
import { emitLog, startTimer } from './logger'
import type { Cart, Stock } from '@/types'

const CART_TOKEN_COOKIE = 'cart-token'
const CART_TOKEN_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

/**
 * Refreshes the cart token cookie expiry to 24 hours from now.
 * Called after every successful cart interaction to implement sliding expiration.
 * This keeps the client cookie and server token expiration aligned:
 * - Active users get their session extended indefinitely
 * - Inactive users (24h+) have both cookie and server token expire simultaneously
 */
async function refreshCartTokenExpiry(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CART_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CART_TOKEN_MAX_AGE,
    path: '/',
  })
  
  emitLog({
    level: 'info',
    service: 'swag-store-api',
    category: 'cart_lifecycle',
    method: 'COOKIE_REFRESH',
    path: 'cookie://cart-token',
    endpoint: 'refreshCartTokenExpiry',
    durationMs: 0,
    success: true,
    cartTokenPresent: true,
    cartAction: 'create',
    params: { maxAge: CART_TOKEN_MAX_AGE },
  })
}

async function getOrCreateCartToken(): Promise<string> {
  const cookieStore = await cookies()
  let token = cookieStore.get(CART_TOKEN_COOKIE)?.value

  if (token) {
    // Log that we read an existing token
    emitLog({
      level: 'info',
      service: 'swag-store-api',
      category: 'cart_lifecycle',
      method: 'COOKIE_READ',
      path: 'cookie://cart-token',
      endpoint: 'getCartToken',
      durationMs: 0,
      success: true,
      cartTokenPresent: true,
      cartAction: 'read',
    })
  } else {
    // Create new cart and log it
    const getElapsed = startTimer()
    try {
      //* Created cart result
      const result = await createCart()

      //* Cart Token
      token = result.token
      
      // Set initial cookie with 24h expiry
      await refreshCartTokenExpiry(token)

      emitLog({
        level: 'info',
        service: 'swag-store-api',
        category: 'cart_lifecycle',
        method: 'POST',
        path: '/api/cart/create',
        endpoint: 'createCart',
        durationMs: getElapsed(),
        success: true,
        cartTokenPresent: true,
        cartAction: 'create',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      emitLog({
        level: 'error',
        service: 'swag-store-api',
        category: 'cart_lifecycle',
        method: 'POST',
        path: '/api/cart/create',
        endpoint: 'createCart',
        durationMs: getElapsed(),
        success: false,
        cartTokenPresent: false,
        cartAction: 'create',
        errorCode: 'CART_CREATE_FAILED',
        errorMessage,
      })
      throw error
    }
  }

  return token
}

export async function getCartAction(): Promise<Cart | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(CART_TOKEN_COOKIE)?.value

  if (!token) {
    // Log skipped cart read due to no token
    emitLog({
      level: 'info',
      service: 'swag-store-api',
      category: 'cart_lifecycle',
      method: 'GET',
      path: '/api/cart',
      endpoint: 'getCart',
      durationMs: 0,
      success: true,
      cartTokenPresent: false,
      cartAction: 'update',
    })
    return null
  }

  try {
    return await getCart(token)
  } catch (error: unknown) {
    // Token expired or invalid, clear cookie and return empty cart
    const message = error instanceof Error ? error.message : ''
    // Token expired or invalid, clear stale cookie
    if (message.includes('404') || message.includes('401') || message.includes('expired')) {
      cookieStore.delete(CART_TOKEN_COOKIE)
    }
    return null
  }
}

export async function addToCartAction(
  productId: string,
  quantity: number
): Promise<Cart> {
  const token = await getOrCreateCartToken()
  const cart = await addToCart(token, productId, quantity)

// Slide the cookie expiration forward — matches API's "24hr of inactivity" behavior
  await refreshCartTokenExpiry(token)

  // Log cache invalidation event
  emitLog({
    level: 'info',
    service: 'swag-store-api',
    category: 'cache_event',
    method: 'UPDATE_TAG',
    path: 'cache://cart',
    endpoint: 'addToCartAction',
    durationMs: 0,
    success: true,
    cacheTags: ['cart'],
    cartAction: 'add',
    cartTokenPresent: true,
    params: { productId, quantity },
  })

  return cart
}

export async function updateCartItemAction(
  itemId: string,
  quantity: number
): Promise<Cart> {
  const cookieStore = await cookies()
  const token = cookieStore.get(CART_TOKEN_COOKIE)?.value

  if (!token) {
    emitLog({
      level: 'warn',
      service: 'swag-store-api',
      category: 'cart_lifecycle',
      method: 'PATCH',
      path: `/api/cart/${itemId}`,
      endpoint: 'updateCartItem',
      durationMs: 0,
      success: false,
      cartTokenPresent: false,
      cartAction: 'update',
      errorCode: 'NO_CART_TOKEN',
      errorMessage: 'No cart token available for update',
    })
    throw new Error('No cart token')
  }

  const cart = await updateCartItem(token, itemId, quantity)

  // Slide the cookie expiration forward — matches API's "24hr of inactivity" behavior
  await refreshCartTokenExpiry(token)

  // Log cache invalidation event
  emitLog({
    level: 'info',
    service: 'swag-store-api',
    category: 'cache_event',
    method: 'UPDATE_TAG',
    path: 'cache://cart',
    endpoint: 'updateCartItemAction',
    durationMs: 0,
    success: true,
    cacheTags: ['cart'],
    cartAction: 'update',
    cartTokenPresent: true,
    params: { itemId, quantity },
  })

  return cart
}

export async function removeCartItemAction(itemId: string): Promise<Cart> {
  const cookieStore = await cookies()
  const token = cookieStore.get(CART_TOKEN_COOKIE)?.value

  if (!token) {
    emitLog({
      level: 'warn',
      service: 'swag-store-api',
      category: 'cart_lifecycle',
      method: 'DELETE',
      path: `/api/cart/${itemId}`,
      endpoint: 'removeCartItem',
      durationMs: 0,
      success: false,
      cartTokenPresent: false,
      cartAction: 'remove',
      errorCode: 'NO_CART_TOKEN',
      errorMessage: 'No cart token available for remove',
    })
    throw new Error('No cart token')
  }

  const cart = await removeCartItem(token, itemId)

  // Slide the cookie expiration forward — matches API's "24hr of inactivity" behavior
  await refreshCartTokenExpiry(token)

  // Log cache invalidation event
  emitLog({
    level: 'info',
    service: 'swag-store-api',
    category: 'cache_event',
    method: 'UPDATE_TAG',
    path: 'cache://cart',
    endpoint: 'removeCartItemAction',
    durationMs: 0,
    success: true,
    cacheTags: ['cart'],
    cartAction: 'remove',
    cartTokenPresent: true,
    params: { itemId },
  })

  return cart
}

export async function getStockAction(productId: string) {
  return fetchProductStock(productId)
}

/**
 * Batch fetch stock for multiple products server-side
 * Use this in server components to eliminate N+1 client-side requests
 */
export async function getBatchStockAction(productIds: string[]): Promise<Map<string, Stock>> {
  const { fetchProductsStock } = await import('./api')
  return fetchProductsStock(productIds)
}
