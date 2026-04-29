type ProductoDB = {
  id: number
  name: string
  price: number
  stock: number
  image: string | null
  category: string | null
  variation: string | null
  code: string | null
}

type NuevoProductoPayload = {
  name: string
  price: number
  stock: number
  image?: string
  category?: string
  variation?: string
  code?: string
}

type MovimientoVenta = {
  id: number
  createdAt: string
  paymentMethod: string
  itemsCount: number
  subtotal: number
  discountPercent: number
  discountAmount: number
  total: number
}

type NuevoMovimientoPayload = {
  createdAt: string
  paymentMethod: string
  itemsCount: number
  subtotal: number
  discountPercent: number
  discountAmount: number
  total: number
}

type ElectronApi = {
  getProducts: () => Promise<ProductoDB[]>
  addProduct: (product: NuevoProductoPayload) => Promise<ProductoDB>
  updateProduct: (id: number, product: NuevoProductoPayload) => Promise<ProductoDB | null>
  deleteProduct: (id: number) => Promise<boolean>
  getMovements: () => Promise<MovimientoVenta[]>
  addMovement: (movement: NuevoMovimientoPayload) => Promise<MovimientoVenta>
  pickAndStoreImage: () => Promise<string | null>
}

declare global {
  interface Window {
    api?: ElectronApi
  }
}

export {}
