export type ProductoDB = {
  id: number
  name: string
  price: number
  stock: number
  image: string | null
  category: string | null
  variation: string | null
  code: string | null
}

export type NuevoProducto = {
  name: string
  price: number
  stock: number
  image: string
  category: string
  variation: string
  code: string
}

export const initialProductForm: NuevoProducto = {
  name: '',
  price: 0,
  stock: 0,
  image: '',
  category: '',
  variation: '+0.0%',
  code: '',
}
