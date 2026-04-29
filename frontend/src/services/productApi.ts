import type { NuevoProducto, ProductoDB } from '../types/product'

export type MovementPayload = {
  createdAt: string
  paymentMethod: string
  itemsCount: number
  subtotal: number
  discountPercent: number
  discountAmount: number
  total: number
}

export type MovementDB = MovementPayload & {
  id: number
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

export async function createMovement(movement: MovementPayload): Promise<MovementDB> {
  ensureElectronApi()
  return window.api!.addMovement(movement)
}
