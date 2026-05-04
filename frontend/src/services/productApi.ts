import type { NuevoProducto, ProductoDB } from '../types/product'

export type MovementLineItemPayload = {
  productId: number
  productName: string
  unitPrice: number
  quantity: number
}

export type MovementPayload = {
  createdAt: string
  paymentMethod: string
  itemsCount: number
  subtotal: number
  discountPercent: number
  discountAmount: number
  total: number
  items?: MovementLineItemPayload[]
}

export type MovementDB = Omit<MovementPayload, 'items'> & {
  id: number
}

export type MovementLineItemDB = MovementLineItemPayload & {
  id: number
  movementId: number
}

export type MovementDetailDB = MovementDB & {
  items: MovementLineItemDB[]
}

function ensureElectronApi() {
  if (!window.api) {
    throw new Error('No se detecto Electron API. Ejecuta la app con Electron.')
  }
}

export async function fetchProducts(): Promise<ProductoDB[]> {
  ensureElectronApi()
  return window.api!.getProducts()
}

export async function createProduct(product: NuevoProducto): Promise<ProductoDB> {
  ensureElectronApi()
  return window.api!.addProduct(product)
}

export async function updateProduct(id: number, product: NuevoProducto): Promise<ProductoDB | null> {
  ensureElectronApi()
  return window.api!.updateProduct(id, product)
}

export async function deleteProduct(id: number): Promise<boolean> {
  ensureElectronApi()
  return window.api!.deleteProduct(id)
}

export async function fetchMovements(): Promise<MovementDB[]> {
  ensureElectronApi()
  return window.api!.getMovements()
}

export async function fetchMovementDetail(id: number): Promise<MovementDetailDB | null> {
  ensureElectronApi()
  return window.api!.getMovementDetail(id)
}

export async function createMovement(movement: MovementPayload): Promise<MovementDB> {
  ensureElectronApi()
  return window.api!.addMovement(movement)
}

export async function deleteMovement(id: number): Promise<boolean> {
  ensureElectronApi()
  return window.api!.deleteMovement(id)
}
