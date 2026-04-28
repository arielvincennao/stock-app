import type { NuevoProducto, ProductoDB } from '../types/product'

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1584473457493-17c6f0d35f89?auto=format&fit=crop&w=200&q=80'

export function getDisplayVariation(product: ProductoDB) {
  return product.variation || '+0.0%'
}

export function getDisplayImage(product: ProductoDB) {
  if (!product.image) return DEFAULT_IMAGE

  if (/^https?:\/\//i.test(product.image)) {
    return DEFAULT_IMAGE
  }

  if (/^file:\/\//i.test(product.image)) {
    return product.image
  }

  const normalizedPath = product.image.replace(/\\/g, '/')
  return encodeURI(`file:///${normalizedPath}`)
}

export function normalizeProductForm(form: NuevoProducto): NuevoProducto {
  return {
    ...form,
    name: form.name.trim(),
    category: form.category.trim(),
    image: form.image.trim(),
    code: form.code.trim(),
  }
}

export function formatPrice(price: number) {
  return `$${price}`
}
