'use server'

import 'server-only'
import { cookies } from 'next/headers'
import { createCart, addToCart, updateCartItem, removeCartItem, getCart, fetchProductStock } from './api'
import type { Cart } from '@/types'

const CART_TOKEN_COOKIE = 'cart-token'

async function getOrCreateCartToken(): Promise<string> {
  const cookieStore = await cookies()
  let token = cookieStore.get(CART_TOKEN_COOKIE)?.value
  
  if (!token) {
    const result = await createCart()
    token = result.token
    cookieStore.set(CART_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours (matches API cart expiry)
      path: '/',
    })
  }
  
  return token
}

export async function getCartAction(): Promise<Cart | null> {
  try {
    const token = await getOrCreateCartToken()
    return await getCart(token)
  } catch (error: unknown) {
    // Token expired or invalid — clear cookie and return empty cart
    const err = error as { status?: number; message?: string }
    if (err?.status === 404 || err?.status === 401 || err?.message?.includes('expired')) {
      const cookieStore = await cookies()
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
  return await addToCart(token, productId, quantity)
}

export async function updateCartItemAction(
  itemId: string,
  quantity: number
): Promise<Cart> {
  const cookieStore = await cookies()
  const token = cookieStore.get(CART_TOKEN_COOKIE)?.value
  
  if (!token) {
    throw new Error('No cart token')
  }
  
  return await updateCartItem(token, itemId, quantity)
}

export async function removeCartItemAction(itemId: string): Promise<Cart> {
  const cookieStore = await cookies()
  const token = cookieStore.get(CART_TOKEN_COOKIE)?.value
  
  if (!token) {
    throw new Error('No cart token')
  }
  
  return await removeCartItem(token, itemId)
}

export async function getStockAction(productId: string) {
  return fetchProductStock(productId)
}
