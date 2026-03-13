import 'server-only'

import type { Product, Stock, Promotion, Category, Cart, CartItem, StoreConfig } from '@/types'
import { emitLog, startTimer, type ApiLogEntry } from './logger'

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://vercel-swag-store-api.vercel.app/api'
const API_BYPASS_TOKEN = process.env.API_BYPASS_TOKEN ?? 'OykROcuULI6YJwAwk3VnWv4gMMbpAq6q'

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-vercel-protection-bypass': API_BYPASS_TOKEN ?? '',
  }
}

// ─── Instrumented Fetch Helper ──────────────────────────────

type LogMeta = Partial<ApiLogEntry>

async function instrumentedFetch(
  url: string,
  options: RequestInit,
  logMeta: LogMeta
): Promise<Response> {
  const getElapsed = startTimer()
  const method = options.method ?? 'GET'
  const path = new URL(url).pathname

  try {
    const response = await fetch(url, options)
    const durationMs = getElapsed()

    if (response.ok) {
      emitLog({
        level: 'info',
        service: 'swag-store-api',
        category: 'api_request',
        method,
        path,
        endpoint: logMeta.endpoint ?? 'unknown',
        timestamp: new Date().toISOString(),
        durationMs,
        status: response.status,
        success: true,
        ...logMeta,
      })
    } else {
      emitLog({
        level: 'error',
        service: 'swag-store-api',
        category: 'api_error',
        method,
        path,
        endpoint: logMeta.endpoint ?? 'unknown',
        timestamp: new Date().toISOString(),
        durationMs,
        status: response.status,
        success: false,
        errorCode: `HTTP_${response.status}`,
        errorMessage: response.statusText,
        ...logMeta,
      })
    }

    return response
  } catch (error) {
    const durationMs = getElapsed()
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    emitLog({
      level: 'error',
      service: 'swag-store-api',
      category: 'api_error',
      method,
      path,
      endpoint: logMeta.endpoint ?? 'unknown',
      timestamp: new Date().toISOString(),
      durationMs,
      success: false,
      errorCode: 'NETWORK_ERROR',
      errorMessage,
      ...logMeta,
    })

    throw error
  }
}

// ─── Products ───────────────────────────────────────────────

type FetchProductsParams = {
  featured?: boolean
  category?: string
  search?: string
  page?: number
  limit?: number
}

type ProductsResponse = {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function fetchProducts(params?: FetchProductsParams): Promise<ProductsResponse> {
  const url = new URL(`${API_BASE_URL}/products`)

  if (params?.featured !== undefined) {
    url.searchParams.set('featured', String(params.featured))
  }
  if (params?.category) {
    url.searchParams.set('category', params.category)
  }
  if (params?.search) {
    url.searchParams.set('search', params.search)
  }
  if (params?.page) {
    url.searchParams.set('page', String(params.page))
  }
  if (params?.limit) {
    url.searchParams.set('limit', String(params.limit))
  }

  const response = await instrumentedFetch(
    url.toString(),
    { headers: getHeaders() },
    {
      endpoint: 'getProducts',
      cacheStrategy: 'use_cache',
      cacheProfile: 'hours',
      cacheTags: ['products'],
      params: {
        featured: params?.featured,
        category: params?.category,
        search: params?.search,
        page: params?.page,
        limit: params?.limit,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }

  const json = await response.json()

  // API wraps responses in { success, data, meta }
  const products: Product[] = json?.data ?? json?.products ?? (Array.isArray(json) ? json : [])
  const pagination = json?.meta?.pagination

  return {
    products,
    total: pagination?.total ?? products.length,
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? products.length,
    totalPages: pagination?.totalPages ?? 1,
  }
}

export async function fetchProduct(idOrSlug: string): Promise<Product | null> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/products/${idOrSlug}`,
    { headers: getHeaders() },
    {
      endpoint: 'getProductBySlugOrId',
      cacheStrategy: 'use_cache',
      cacheProfile: 'days',
      cacheTags: ['products', `product-${idOrSlug}`],
      params: { slugOrId: idOrSlug },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch product: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

export async function fetchProductStock(idOrSlug: string): Promise<Stock> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/products/${idOrSlug}/stock`,
    {
      headers: getHeaders(),
      cache: 'no-store',
    },
    {
      endpoint: 'getProductStock',
      cacheStrategy: 'no_cache',
      params: { productId: idOrSlug },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch product stock: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

// ─── Promotions ─────────────────────────────────────────────

export async function fetchPromotion(): Promise<Promotion | null> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/promotions`,
    {
      headers: getHeaders(),
      cache: 'no-store',
    },
    {
      endpoint: 'getPromotion',
      cacheStrategy: 'suspense_stream',
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch promotion: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

// ─── Categories ─────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/categories`,
    { headers: getHeaders() },
    {
      endpoint: 'getCategories',
      cacheStrategy: 'use_cache',
      cacheProfile: 'days',
      cacheTags: ['categories'],
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

// ─── Store Config ───────────────────────────────────────────

export async function fetchStoreConfig(): Promise<StoreConfig> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/store/config`,
    { headers: getHeaders() },
    {
      endpoint: 'getStoreConfig',
      cacheStrategy: 'use_cache',
      cacheProfile: 'max',
      cacheTags: ['store-config'],
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch store config: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

// ─── Cart ───────────────────────────────────────────────────

/**
 * Normalize the API cart response into our Cart type.
 * The API returns items as { productId, quantity, product: {...}, lineTotal }
 * We flatten this into our CartItem shape: { id, productId, name, image, price, quantity }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCart(raw: any): Cart {
  const items: CartItem[] = (raw.items ?? []).map((item: Record<string, unknown>) => {
    const product = item.product as Record<string, unknown> | undefined
    return {
      id: (item.productId as string) ?? '',
      productId: (item.productId as string) ?? '',
      name: (product?.name as string) ?? 'Unknown Product',
      image: ((product?.images as string[]) ?? [])[0] ?? '/placeholder.svg',
      price: (product?.price as number) ?? 0,
      quantity: (item.quantity as number) ?? 1,
    }
  })

  return {
    token: raw.token ?? '',
    items,
    totalItems: raw.totalItems ?? items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0),
    subtotal: raw.subtotal ?? items.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0),
    currency: raw.currency ?? 'USD',
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
  }
}

export async function createCart(): Promise<{ token: string }> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/cart/create`,
    {
      method: 'POST',
      headers: getHeaders(),
    },
    {
      endpoint: 'createCart',
      cacheStrategy: 'no_cache',
      cartAction: 'create',
      cartTokenPresent: false,
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to create cart: ${response.statusText}`)
  }

  const token = response.headers.get('x-cart-token')

  if (!token) {
    // Fallback: try reading token from response body
    const json = await response.json()
    const bodyToken = json?.data?.token ?? json?.token
    if (bodyToken) return { token: bodyToken }
    throw new Error('No cart token received from server')
  }

  return { token }
}

export async function getCart(cartToken: string): Promise<Cart> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/cart`,
    {
      headers: {
        ...getHeaders(),
        'x-cart-token': cartToken,
      },
    },
    {
      endpoint: 'getCart',
      cacheStrategy: 'no_cache',
      cartAction: 'read',
      cartTokenPresent: true,
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to get cart: ${response.statusText}`)
  }

  const json = await response.json()
  return normalizeCart(json?.data ?? json)
}

export async function addToCart(
  cartToken: string,
  productId: string,
  quantity: number
): Promise<Cart> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/cart`,
    {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'x-cart-token': cartToken,
      },
      body: JSON.stringify({ productId, quantity }),
    },
    {
      endpoint: 'addToCart',
      cacheStrategy: 'no_cache',
      cartAction: 'add',
      cartTokenPresent: true,
      params: { productId, quantity },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to add to cart: ${response.statusText}`)
  }

  const json = await response.json()
  return normalizeCart(json?.data ?? json)
}

export async function updateCartItem(
  cartToken: string,
  itemId: string,
  quantity: number
): Promise<Cart> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/cart/${itemId}`,
    {
      method: 'PATCH',
      headers: {
        ...getHeaders(),
        'x-cart-token': cartToken,
      },
      body: JSON.stringify({ quantity }),
    },
    {
      endpoint: 'updateCartItem',
      cacheStrategy: 'no_cache',
      cartAction: 'update',
      cartTokenPresent: true,
      params: { itemId, quantity },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to update cart item: ${response.statusText}`)
  }

  const json = await response.json()
  return normalizeCart(json?.data ?? json)
}

export async function removeCartItem(cartToken: string, itemId: string): Promise<Cart> {
  const response = await instrumentedFetch(
    `${API_BASE_URL}/cart/${itemId}`,
    {
      method: 'DELETE',
      headers: {
        ...getHeaders(),
        'x-cart-token': cartToken,
      },
    },
    {
      endpoint: 'removeCartItem',
      cacheStrategy: 'no_cache',
      cartAction: 'remove',
      cartTokenPresent: true,
      params: { itemId },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to remove cart item: ${response.statusText}`)
  }

  const json = await response.json()
  return normalizeCart(json?.data ?? json)
}
