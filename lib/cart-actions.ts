'use server'

import 'server-only'
import { cookies } from 'next/headers'
import { createCart, addToCart, updateCartItem, removeCartItem, getCart, fetchProductStock } from './api'
import { emitLog, startTimer } from './logger'
import type { Cart } from '@/types'

const CART_TOKEN_COOKIE = 'cart-token'

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
      timestamp: new Date().toISOString(),
      durationMs: 0,
      success: true,
      cartTokenPresent: true,
      cartAction: 'read',
    })
  } else {
    // Create new cart and log it
    const getElapsed = startTimer()
    try {
      const result = await createCart()
      token = result.token
      cookieStore.set(CART_TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours (matches API cart expiry)
        path: '/',
      })
      
      emitLog({
        level: 'info',
        service: 'swag-store-api',
        category: 'cart_lifecycle',
        method: 'POST',
        path: '/api/cart/create',
        endpoint: 'createCart',
        timestamp: new Date().toISOString(),
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
        timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
      durationMs: 0,
      success: true,
      cartTokenPresent: false,
      cartAction: 'read',
    })
    return null
  }
  
  try {
    return await getCart(token)
  } catch (error: unknown) {
    // Token expired or invalid — clear cookie and return empty cart
    const err = error as { status?: number; message?: string }
    if (err?.status === 404 || err?.status === 401 || err?.message?.includes('expired')) {
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
  
  // Log cache invalidation event
  emitLog({
    level: 'info',
    service: 'swag-store-api',
    category: 'cache_event',
    method: 'UPDATE_TAG',
    path: 'cache://cart',
    endpoint: 'addToCartAction',
    timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
  
  // Log cache invalidation event
  emitLog({
    level: 'info',
    service: 'swag-store-api',
    category: 'cache_event',
    method: 'UPDATE_TAG',
    path: 'cache://cart',
    endpoint: 'updateCartItemAction',
    timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
  
  // Log cache invalidation event
  emitLog({
    level: 'info',
    service: 'swag-store-api',
    category: 'cache_event',
    method: 'UPDATE_TAG',
    path: 'cache://cart',
    endpoint: 'removeCartItemAction',
    timestamp: new Date().toISOString(),
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
