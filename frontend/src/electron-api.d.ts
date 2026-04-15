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

type ElectronApi = {
  getProducts: () => Promise<ProductoDB[]>
  addProduct: (product: NuevoProductoPayload) => Promise<ProductoDB>
}

declare global {
  interface Window {
    api?: ElectronApi
  }
}

export {}
