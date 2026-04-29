import { useEffect, useMemo, useState } from 'react'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../services/productApi'
import { initialProductForm, type NuevoProducto, type ProductoDB } from '../types/product'
import { normalizeProductForm } from '../utils/productFormat'
import { validateProductForm } from '../utils/productValidation'

export type ConfirmState =
  | { type: 'delete'; product: ProductoDB }
  | { type: 'edit'; productId: number; payload: NuevoProducto; productName: string }

type UseProductsParams = {
  productsPerPage: number
  onError: (message: string) => void
}

export function useProducts({ productsPerPage, onError }: UseProductsParams) {
  const [productos, setProductos] = useState<ProductoDB[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<NuevoProducto>(initialProductForm)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<NuevoProducto>(initialProductForm)
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<
    'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'
  >('name-asc')
  const [selectedProduct, setSelectedProduct] = useState<ProductoDB | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const loadProducts = async () => {
    try {
      setLoading(true)
      onError('')
      const data = await fetchProducts()
      setProductos(data)
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        onError(fetchError.message)
      } else {
        onError('No se pudieron cargar los productos desde database.db.')
      }
      console.error(fetchError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy])

  const agregarProducto = async (onSuccess: () => void) => {
    const sanitizedForm = normalizeProductForm(form)
    const validationError = validateProductForm(sanitizedForm)
    if (validationError) {
      onError(validationError)
      return
    }

    try {
      onError('')
      await createProduct(sanitizedForm)
      setForm(initialProductForm)
      await loadProducts()
      onSuccess()
    } catch (addError) {
      if (addError instanceof Error) {
        onError(addError.message)
      } else {
        onError('No se pudo crear el producto en database.db.')
      }
      console.error(addError)
    }
  }

  const seleccionarImagenNuevoProducto = async () => {
    if (!window.api) {
      onError('No se detecto Electron API. Ejecuta la app con Electron.')
      return
    }

    try {
      const localPath = await window.api.pickAndStoreImage()
      if (!localPath) return
      setForm((prev) => ({ ...prev, image: localPath }))
      onError('')
    } catch (pickError) {
      if (pickError instanceof Error) {
        onError(pickError.message)
      } else {
        onError('No se pudo guardar la imagen localmente.')
      }
    }
  }

  const seleccionarImagenEdicion = async () => {
    if (!window.api) {
      onError('No se detecto Electron API. Ejecuta la app con Electron.')
      return
    }

    try {
      const localPath = await window.api.pickAndStoreImage()
      if (!localPath) return
      setEditForm((prev) => ({ ...prev, image: localPath }))
      onError('')
    } catch (pickError) {
      if (pickError instanceof Error) {
        onError(pickError.message)
      } else {
        onError('No se pudo guardar la imagen localmente.')
      }
    }
  }

  const editarProducto = (producto: ProductoDB) => {
    onError('')
    setEditingProductId(producto.id)
    setEditForm({
      name: producto.name,
      category: producto.category ?? '',
      price: producto.price,
      stock: producto.stock,
      image: producto.image ?? '',
      variation: producto.variation ?? '+0.0%',
      code: producto.code ?? '',
    })
  }

  const guardarEdicionProducto = () => {
    if (editingProductId === null) return

    const payload = normalizeProductForm(editForm)
    const validationError = validateProductForm(payload)
    if (validationError) {
      onError(validationError)
      return
    }

    setConfirmState({
      type: 'edit',
      productId: editingProductId,
      payload,
      productName: payload.name,
    })
  }

  const confirmarAccion = async () => {
    if (!confirmState) return

    if (confirmState.type === 'edit') {
      try {
        onError('')
        const updated = await updateProduct(confirmState.productId, confirmState.payload)
        if (!updated) {
          onError('No se encontro el producto para editar.')
          setConfirmState(null)
          return
        }
        setEditingProductId(null)
        setEditForm(initialProductForm)
        setConfirmState(null)
        await loadProducts()
      } catch (updateError) {
        if (updateError instanceof Error) {
          onError(updateError.message)
        } else {
          onError('No se pudo editar el producto.')
        }
        console.error(updateError)
      }
      return
    }

    try {
      onError('')
      const deleted = await deleteProduct(confirmState.product.id)
      if (!deleted) {
        onError('No se encontro el producto para eliminar.')
        setConfirmState(null)
        return
      }
      setConfirmState(null)
      await loadProducts()
    } catch (deleteError) {
      if (deleteError instanceof Error) {
        onError(deleteError.message)
      } else {
        onError('No se pudo eliminar el producto.')
      }
      console.error(deleteError)
    }
  }

  const eliminarProducto = (producto: ProductoDB) => {
    setConfirmState({ type: 'delete', product: producto })
  }

  const verDetallesProducto = (producto: ProductoDB) => {
    setSelectedProduct(producto)
    onError('')
  }

  const cancelarEdicion = () => {
    setEditingProductId(null)
    setEditForm(initialProductForm)
    onError('')
  }

  const cancelarConfirmacion = () => {
    setConfirmState(null)
  }

  const productosFiltradosYOrdenados = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    const filtered = productos.filter((producto) => {
      if (!query) return true
      return (
        producto.name.toLowerCase().includes(query) ||
        (producto.category ?? '').toLowerCase().includes(query) ||
        (producto.code ?? '').toLowerCase().includes(query)
      )
    })

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'stock-asc':
          return a.stock - b.stock
        case 'stock-desc':
          return b.stock - a.stock
        default:
          return 0
      }
    })
  }, [productos, searchTerm, sortBy])

  const totalPages = Math.max(1, Math.ceil(productosFiltradosYOrdenados.length / productsPerPage))
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const productosPaginados = productosFiltradosYOrdenados.slice(startIndex, endIndex)

  const confirmarTitulo =
    confirmState?.type === 'edit'
      ? `Confirmar edicion de "${confirmState.productName}"?`
      : confirmState
        ? `Seguro que deseas eliminar el producto "${confirmState.product.name}"?`
        : ''

  const confirmarDescripcion =
    confirmState?.type === 'edit'
      ? 'Se guardaran los cambios del producto.'
      : confirmState
        ? 'Esta accion no se puede deshacer.'
        : ''

  const confirmarBoton = confirmState?.type === 'edit' ? 'Si, guardar cambios' : 'Si, eliminar'
  const confirmarClaseBoton = confirmState?.type === 'edit' ? 'primary-btn' : 'item-btn delete-btn'
  const confirmarClaseModal = confirmState?.type === 'edit' ? 'confirm-modal' : 'confirm-modal confirm-delete'
  const cancelarBotonClase = confirmState?.type === 'edit' ? 'secondary-btn' : 'item-btn edit-btn'

  return {
    productos,
    loading,
    form,
    setForm,
    editingProductId,
    editForm,
    setEditForm,
    confirmState,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedProduct,
    currentPage,
    setCurrentPage,
    totalPages,
    productosPaginados,
    loadProducts,
    agregarProducto,
    seleccionarImagenNuevoProducto,
    seleccionarImagenEdicion,
    editarProducto,
    guardarEdicionProducto,
    confirmarAccion,
    eliminarProducto,
    verDetallesProducto,
    cancelarEdicion,
    cancelarConfirmacion,
    confirmarTitulo,
    confirmarDescripcion,
    confirmarBoton,
    confirmarClaseBoton,
    confirmarClaseModal,
    cancelarBotonClase,
    cancelarTexto: 'Cancelar',
  }
}
