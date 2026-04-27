import type { NuevoProducto, ProductoDB } from '../types/product'

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
