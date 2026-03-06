import 'server-only'

import type { Product, Stock, Promotion, Category, Cart, StoreConfig } from '@/types'

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://vercel-swag-store-api.vercel.app/api'
const API_BYPASS_TOKEN = process.env.API_BYPASS_TOKEN ?? 'OykROcuULI6YJwAwk3VnWv4gMMbpAq6q'

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-vercel-protection-bypass': API_BYPASS_TOKEN ?? '',
  }
}

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

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  })

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
  const response = await fetch(`${API_BASE_URL}/products/${idOrSlug}`, {
    headers: getHeaders(),
  })

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
  const response = await fetch(`${API_BASE_URL}/products/${idOrSlug}/stock`, {
    headers: getHeaders(),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch product stock: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

export async function fetchPromotion(): Promise<Promotion | null> {
  const response = await fetch(`${API_BASE_URL}/promotions`, {
    headers: getHeaders(),
    cache: 'no-store',
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch promotion: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

export async function fetchStoreConfig(): Promise<StoreConfig> {
  const response = await fetch(`${API_BASE_URL}/store/config`, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch store config: ${response.statusText}`)
  }

  const json = await response.json()
  return json?.data ?? json
}

export async function createCart(): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/cart/create`, {
    method: 'POST',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to create cart: ${response.statusText}`)
  }

  const token = response.headers.get('x-cart-token')
  
  if (!token) {
    throw new Error('No cart token received from server')
  }

  return { token }
}

export async function getCart(cartToken: string): Promise<Cart> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: {
      ...getHeaders(),
      'x-cart-token': cartToken,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get cart: ${response.statusText}`)
  }

  return response.json()
}

export async function addToCart(
  cartToken: string,
  productId: string,
  quantity: number
): Promise<Cart> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'x-cart-token': cartToken,
    },
    body: JSON.stringify({ productId, quantity }),
  })

  if (!response.ok) {
    throw new Error(`Failed to add to cart: ${response.statusText}`)
  }

  return response.json()
}

export async function updateCartItem(
  cartToken: string,
  itemId: string,
  quantity: number
): Promise<Cart> {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(),
      'x-cart-token': cartToken,
    },
    body: JSON.stringify({ quantity }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update cart item: ${response.statusText}`)
  }

  return response.json()
}

export async function removeCartItem(cartToken: string, itemId: string): Promise<Cart> {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: 'DELETE',
    headers: {
      ...getHeaders(),
      'x-cart-token': cartToken,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to remove cart item: ${response.statusText}`)
  }

  return response.json()
}
