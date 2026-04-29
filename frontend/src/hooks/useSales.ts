import { useEffect, useMemo, useState } from 'react'
import type { SaleCartItem } from '../components/SellView'
import { createMovement, fetchMovements, type MovementDB, updateProduct } from '../services/productApi'
import type { ProductoDB } from '../types/product'

type UseSalesParams = {
  productos: ProductoDB[]
  loadProducts: () => Promise<void>
  onError: (message: string) => void
}

export function useSales({ productos, loadProducts, onError }: UseSalesParams) {
  const [salePaymentMethod, setSalePaymentMethod] = useState('Efectivo')
  const [saleDiscountPercent, setSaleDiscountPercent] = useState('0')
  const [saleProductQuery, setSaleProductQuery] = useState('')
  const [saleProductQuantity, setSaleProductQuantity] = useState('1')
  const [saleCart, setSaleCart] = useState<SaleCartItem[]>([])
  const [movements, setMovements] = useState<MovementDB[]>([])
  const [saleMessage, setSaleMessage] = useState('')

  const loadMovements = async () => {
    try {
      const data = await fetchMovements()
      setMovements(data)
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        onError(fetchError.message)
      } else {
        onError('No se pudieron cargar los movimientos.')
      }
      console.error(fetchError)
    }
  }

  useEffect(() => {
    void loadMovements()
  }, [])

  const saleSubtotal = useMemo(
    () => saleCart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [saleCart]
  )
  const parsedDiscountPercent = useMemo(() => {
    const parsed = Number.parseFloat(saleDiscountPercent)
    if (Number.isNaN(parsed) || parsed < 0) return 0
    if (parsed > 100) return 100
    return parsed
  }, [saleDiscountPercent])
  const saleDiscountAmount = useMemo(
    () => (saleSubtotal * parsedDiscountPercent) / 100,
    [saleSubtotal, parsedDiscountPercent]
  )
  const saleTotal = useMemo(() => saleSubtotal - saleDiscountAmount, [saleSubtotal, saleDiscountAmount])
  const saleItemsCount = useMemo(
    () => saleCart.reduce((acc, item) => acc + item.quantity, 0),
    [saleCart]
  )
  const saleSuggestions = useMemo(() => {
    const query = saleProductQuery.trim().toLowerCase()
    if (!query) return []

    return productos
      .filter((producto) => {
        const code = (producto.code ?? '').toLowerCase()
        return producto.name.toLowerCase().includes(query) || code.includes(query)
      })
      .slice(0, 6)
  }, [productos, saleProductQuery])
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(value)

  const agregarProductoAlCarrito = () => {
    const query = saleProductQuery.trim().toLowerCase()
    const quantity = Number.parseInt(saleProductQuantity, 10)

    if (!query) {
      onError('Ingresa un producto para agregar al carrito.')
      return
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      onError('La cantidad debe ser un numero entero mayor a 0.')
      return
    }

    const exactMatch = productos.find((producto) => {
      const code = (producto.code ?? '').toLowerCase()
      return code === query || producto.name.toLowerCase() === query
    })

    const matchedProduct =
      exactMatch ??
      productos.find((producto) => {
        const code = (producto.code ?? '').toLowerCase()
        return producto.name.toLowerCase().includes(query) || code.includes(query)
      })

    if (!matchedProduct) {
      onError('No se encontro un producto que coincida con la busqueda.')
      return
    }

    const existingItem = saleCart.find((item) => item.productId === matchedProduct.id)
    const alreadyInCart = existingItem?.quantity ?? 0
    const requestedQuantity = alreadyInCart + quantity

    if (requestedQuantity > matchedProduct.stock) {
      onError(`Stock insuficiente para "${matchedProduct.name}". Disponible: ${matchedProduct.stock}.`)
      return
    }

    setSaleCart((prev) => {
      if (existingItem) {
        return prev.map((item) =>
          item.productId === matchedProduct.id ? { ...item, quantity: requestedQuantity } : item
        )
      }

      return [
        ...prev,
        {
          productId: matchedProduct.id,
          name: matchedProduct.name,
          unitPrice: matchedProduct.price,
          quantity,
        },
      ]
    })

    setSaleProductQuery('')
    setSaleProductQuantity('1')
    setSaleMessage('')
    onError('')
  }

  const eliminarItemDelCarrito = (productId: number) => {
    setSaleCart((prev) => prev.filter((item) => item.productId !== productId))
    setSaleMessage('')
  }

  const cancelarVenta = () => {
    setSaleCart([])
    setSaleProductQuery('')
    setSaleProductQuantity('1')
    setSaleDiscountPercent('0')
    setSalePaymentMethod('Efectivo')
    setSaleMessage('')
    onError('')
  }

  const cobrarVenta = async () => {
    if (saleCart.length === 0) {
      onError('Agrega al menos un producto al carrito antes de cobrar.')
      return
    }

    try {
      onError('')
      setSaleMessage('')

      const productsById = new Map(productos.map((producto) => [producto.id, producto]))
      const updates = saleCart.map((item) => {
        const sourceProduct = productsById.get(item.productId)
        if (!sourceProduct) {
          throw new Error(`No se encontro el producto "${item.name}" para actualizar stock.`)
        }

        if (item.quantity > sourceProduct.stock) {
          throw new Error(`Stock insuficiente para "${sourceProduct.name}". Disponible: ${sourceProduct.stock}.`)
        }

        return updateProduct(sourceProduct.id, {
          name: sourceProduct.name,
          price: sourceProduct.price,
          stock: sourceProduct.stock - item.quantity,
          image: sourceProduct.image ?? '',
          category: sourceProduct.category ?? '',
          variation: sourceProduct.variation ?? '+0.0%',
          code: sourceProduct.code ?? '',
        })
      })

      await Promise.all(updates)

      await createMovement({
        createdAt: new Date().toISOString(),
        paymentMethod: salePaymentMethod,
        itemsCount: saleItemsCount,
        subtotal: saleSubtotal,
        discountPercent: parsedDiscountPercent,
        discountAmount: saleDiscountAmount,
        total: saleTotal,
      })

      setSaleCart([])
      setSaleProductQuery('')
      setSaleProductQuantity('1')
      setSaleDiscountPercent('0')
      setSalePaymentMethod('Efectivo')
      setSaleMessage('Venta cobrada correctamente.')

      await Promise.all([loadProducts(), loadMovements()])
    } catch (saleError) {
      if (saleError instanceof Error) {
        onError(saleError.message)
      } else {
        onError('No se pudo cobrar la venta.')
      }
      console.error(saleError)
    }
  }

  return {
    salePaymentMethod,
    setSalePaymentMethod,
    saleDiscountPercent,
    setSaleDiscountPercent,
    saleProductQuery,
    setSaleProductQuery,
    saleProductQuantity,
    setSaleProductQuantity,
    saleCart,
    movements,
    saleMessage,
    saleSubtotal,
    saleDiscountAmount,
    saleTotal,
    saleSuggestions,
    formatCurrency,
    agregarProductoAlCarrito,
    eliminarItemDelCarrito,
    cancelarVenta,
    cobrarVenta,
  }
}
