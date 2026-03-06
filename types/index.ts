export type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: number // in cents
  currency: string
  category: string
  images: string[]
  featured: boolean
  tags: string[]
  createdAt: string
}

export type Stock = {
  productId: string
  stock: number
  inStock: boolean
  lowStock: boolean
}

export type Promotion = {
  id: string
  title: string
  description?: string
  discountPercent: number
  code: string
  validFrom: string
  validUntil: string
  active: boolean
}

export type Category = {
  slug: string
  name: string
  productCount: number
}

export type CartItem = {
  id: string
  productId: string
  name: string
  image: string
  price: number // in cents
  quantity: number
}

export type Cart = {
  token: string
  items: CartItem[]
  totalItems: number
  subtotal: number // in cents
  currency: string
  createdAt: string
  updatedAt: string
}

export type StoreConfig = {
  storeName: string
  currency: string
  features: {
    wishlist: boolean
    productComparison: boolean
    reviews: boolean
    liveChat: boolean
    recentlyViewed: boolean
  }
  socialLinks: {
    twitter: string
    github: string
    discord: string
  }
  seo: {
    defaultTitle: string
    titleTemplate: string
    defaultDescription: string
  }
}
