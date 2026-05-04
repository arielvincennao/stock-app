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

type ItemLineaMovimiento = {
  id: number
  movementId: number
  productId: number
  productName: string
  unitPrice: number
  quantity: number
}

type MovimientoDetalle = MovimientoVenta & {
  items: ItemLineaMovimiento[]
}

type ItemLineaNuevoMovimiento = {
  productId: number
  productName: string
  unitPrice: number
  quantity: number
}

type NuevoMovimientoPayload = {
  createdAt: string
  paymentMethod: string
  itemsCount: number
  subtotal: number
  discountPercent: number
  discountAmount: number
  total: number
  items?: ItemLineaNuevoMovimiento[]
}

type ElectronApi = {
  getProducts: () => Promise<ProductoDB[]>
  addProduct: (product: NuevoProductoPayload) => Promise<ProductoDB>
  updateProduct: (id: number, product: NuevoProductoPayload) => Promise<ProductoDB | null>
  deleteProduct: (id: number) => Promise<boolean>
  getMovements: () => Promise<MovimientoVenta[]>
  getMovementDetail: (id: number) => Promise<MovimientoDetalle | null>
  addMovement: (movement: NuevoMovimientoPayload) => Promise<MovimientoVenta>
  deleteMovement: (id: number) => Promise<boolean>
  pickAndStoreImage: () => Promise<string | null>
}

declare global {
  interface Window {
    api?: ElectronApi
  }
}

export {}
