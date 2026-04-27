import type { NuevoProducto } from '../types/product'

const TEXT_PATTERN = /^[a-zA-ZÀ-ÿ0-9 .,_+\-/%()#]*$/
const VARIATION_PATTERN = /^[+-]\d+(\.\d+)?%$/
const URL_PATTERN = /^https?:\/\/[^\s]+$/i

function hasValidText(value: string) {
  return TEXT_PATTERN.test(value)
}

export function validateProductForm(form: NuevoProducto): string | null {
  if (!form.name.trim()) {
    return 'El nombre es obligatorio.'
  }

  if (!hasValidText(form.name) || !hasValidText(form.category) || !hasValidText(form.code)) {
    return 'Nombre, categoria y codigo solo permiten letras, numeros y signos basicos.'
  }

  if (!Number.isFinite(form.price) || form.price < 0) {
    return 'El precio debe ser un numero valido mayor o igual a 0.'
  }

  if (!Number.isInteger(form.stock) || form.stock < 0) {
    return 'El stock debe ser un numero entero mayor o igual a 0.'
  }

  if (form.image.trim() && !URL_PATTERN.test(form.image.trim())) {
    return 'La imagen debe ser una URL valida (http o https).'
  }

  if (!VARIATION_PATTERN.test(form.variation.trim())) {
    return 'La variacion debe tener formato +1.2% o -0.4%.'
  }

  return null
}
