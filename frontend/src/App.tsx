import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { LoginView } from './components/LoginView'
import { Pagination } from './components/Pagination'
import { ProductForm } from './components/ProductForm'
import { ProductList } from './components/ProductList'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from './services/productApi'
import { initialProductForm, type NuevoProducto, type ProductoDB } from './types/product'
import { normalizeProductForm } from './utils/productFormat'
import { validateProductForm } from './utils/productValidation'

type ConfirmState =
  | { type: 'delete'; product: ProductoDB }
  | { type: 'edit'; productId: number; payload: NuevoProducto; productName: string }

function App() {
  const PRODUCTS_PER_PAGE = 10

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [productos, setProductos] = useState<ProductoDB[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [dashboardView, setDashboardView] = useState<'listado' | 'crear' | 'vender' | 'movimientos' | 'configuracion'>(
    'listado'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<NuevoProducto>(initialProductForm)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<NuevoProducto>(initialProductForm)
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<
    'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'
  >('name-asc')

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchProducts()
      setProductos(data)
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        setError(fetchError.message)
      } else {
        setError('No se pudieron cargar los productos desde database.db.')
      }
      console.error(fetchError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const agregarProducto = async () => {
    const sanitizedForm = normalizeProductForm(form)
    const validationError = validateProductForm(sanitizedForm)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setError('')
      await createProduct(sanitizedForm)
      setForm(initialProductForm)
      await loadProducts()
    } catch (addError) {
      if (addError instanceof Error) {
        setError(addError.message)
      } else {
        setError('No se pudo crear el producto en database.db.')
      }
      console.error(addError)
    }
  }

  const editarProducto = (producto: ProductoDB) => {
    setError('')
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

  const guardarEdicionProducto = async () => {
    if (editingProductId === null) return

    const payload = normalizeProductForm(editForm)
    const validationError = validateProductForm(payload)
    if (validationError) {
      setError(validationError)
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
        setError('')
        const updated = await updateProduct(confirmState.productId, confirmState.payload)
        if (!updated) {
          setError('No se encontro el producto para editar.')
          setConfirmState(null)
          return
        }
        setEditingProductId(null)
        setEditForm(initialProductForm)
        setConfirmState(null)
        await loadProducts()
      } catch (updateError) {
        if (updateError instanceof Error) {
          setError(updateError.message)
        } else {
          setError('No se pudo editar el producto.')
        }
        console.error(updateError)
      }
      return
    }

    try {
      setError('')
      const deleted = await deleteProduct(confirmState.product.id)
      if (!deleted) {
        setError('No se encontro el producto para eliminar.')
        setConfirmState(null)
        return
      }
      setConfirmState(null)
      await loadProducts()
    } catch (deleteError) {
      if (deleteError instanceof Error) {
        setError(deleteError.message)
      } else {
        setError('No se pudo eliminar el producto.')
      }
      console.error(deleteError)
    }
  }

  const eliminarProducto = (producto: ProductoDB) => {
    setConfirmState({ type: 'delete', product: producto })
  }

  const cancelarEdicion = () => {
    setEditingProductId(null)
    setEditForm(initialProductForm)
    setError('')
  }

  const cancelarConfirmacion = () => {
    setConfirmState(null)
  }

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

  const confirmarBoton =
    confirmState?.type === 'edit'
      ? 'Si, guardar cambios'
      : 'Si, eliminar'

  const confirmarClaseBoton =
    confirmState?.type === 'edit'
      ? 'primary-btn'
      : 'item-btn delete-btn'

  const confirmarClaseModal =
    confirmState?.type === 'edit'
      ? 'confirm-modal'
      : 'confirm-modal confirm-delete'

  const cancelarBotonClase =
    confirmState?.type === 'edit'
      ? 'secondary-btn'
      : 'item-btn edit-btn'

  const cancelarTexto = 'Cancelar'

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy])

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

  const totalPages = Math.max(1, Math.ceil(productosFiltradosYOrdenados.length / PRODUCTS_PER_PAGE))
  const productosParaPaginar = useMemo(() => productosFiltradosYOrdenados, [productosFiltradosYOrdenados])
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const productosPaginados = productosParaPaginar.slice(startIndex, endIndex)

  if (isLoggedIn) {
    return (
      <main className="dashboard-page">
        <button className="secondary-btn dashboard-logout" type="button" onClick={() => setIsLoggedIn(false)}>
          Cerrar sesion
        </button>
        <section className="dashboard-layout">
          <aside className="dashboard-menu">
            <p className="login-kicker">Stock App</p>
            <p className="menu-section-title">OPERACION</p>
            <button
              type="button"
              className={dashboardView === 'vender' ? 'menu-btn active' : 'menu-btn'}
              onClick={() => setDashboardView('vender')}
            >
              Vender
            </button>
            <button
              type="button"
              className={dashboardView === 'listado' || dashboardView === 'crear' ? 'menu-btn active' : 'menu-btn'}
              onClick={() => setDashboardView('listado')}
            >
              Productos
            </button>

            <p className="menu-section-title">CONTROL</p>
            <button
              type="button"
              className={dashboardView === 'movimientos' ? 'menu-btn active' : 'menu-btn'}
              onClick={() => setDashboardView('movimientos')}
            >
              Movimientos
            </button>

            <p className="menu-section-title">SISTEMA</p>
            <button
              type="button"
              className={dashboardView === 'configuracion' ? 'menu-btn active' : 'menu-btn'}
              onClick={() => setDashboardView('configuracion')}
            >
              Configuracion
            </button>
          </aside>
          <section className="dashboard-shell">
            {dashboardView === 'listado' ? (
              <>
                <header className="dashboard-header">
                  <div>
                    <h1>Listado de productos</h1>
                    <p>Productos guardados en SQLite (database.db) desde Electron.</p>
                  </div>
                </header>

                {loading && <p className="status-text">Cargando productos...</p>}
                {error && <p className="error-text">{error}</p>}

                <section className="list-controls" aria-label="Buscar y ordenar productos">
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Buscar por nombre, categoria o codigo"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value as 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'
                      )
                    }
                  >
                    <option value="name-asc">Nombre (A-Z)</option>
                    <option value="name-desc">Nombre (Z-A)</option>
                    <option value="price-asc">Precio (menor a mayor)</option>
                    <option value="price-desc">Precio (mayor a menor)</option>
                    <option value="stock-asc">Stock (menor a mayor)</option>
                    <option value="stock-desc">Stock (mayor a menor)</option>
                  </select>
                </section>

                <ProductList
                  products={productosPaginados}
                  loading={loading}
                  onEdit={editarProducto}
                  onDelete={eliminarProducto}
                />
                <Pagination totalPages={totalPages} currentPage={currentPage} onChangePage={setCurrentPage} />
              </>
            ) : dashboardView === 'crear' ? (
              <>
                <header className="dashboard-header">
                  <div>
                    <h1>Crear producto</h1>
                    <p>Crea y guarda nuevos productos en SQLite (database.db).</p>
                  </div>
                </header>

                {error && <p className="error-text">{error}</p>}

                <ProductForm
                  form={form}
                  onChange={setForm}
                  onSubmit={() => void agregarProducto()}
                />
              </>
            ) : dashboardView === 'vender' ? (
              <section className="sell-panel" aria-label="Panel de venta">
                <header className="dashboard-header">
                  <div>
                    <h1>Vender</h1>
                    <p>Vista de venta</p>
                  </div>
                </header>

                <section className="sell-layout">
                  <article className="sell-card sell-card-main">
                    <h2>Datos de la venta</h2>
                    <div className="sell-form-grid">
                      <label className="sell-field">
                        <span>Cliente</span>
                        <input type="text" placeholder="Nombre del cliente" />
                      </label>
                      <label className="sell-field">
                        <span>DNI / CUIT</span>
                        <input type="text" placeholder="Documento" />
                      </label>
                      <label className="sell-field">
                        <span>Metodo de pago</span>
                        <select>
                          <option>Efectivo</option>
                          <option>Debito</option>
                          <option>Credito</option>
                          <option>Transferencia</option>
                        </select>
                      </label>
                      <label className="sell-field">
                        <span>Descuento</span>
                        <input type="text" placeholder="0%" />
                      </label>
                    </div>
                  </article>

                  <article className="sell-card sell-card-main">
                    <h2>Agregar producto</h2>
                    <div className="sell-add-row">
                      <input type="text" placeholder="Buscar producto por nombre o codigo" />
                      <input type="number" placeholder="Cantidad" />
                      <button className="primary-btn" type="button">
                        Agregar
                      </button>
                    </div>
                  </article>

                  <article className="sell-card sell-card-main">
                    <h2>Detalle</h2>
                    <div className="sell-table">
                      <div className="sell-table-head">
                        <span>Producto</span>
                        <span>Cant.</span>
                        <span>P. unitario</span>
                        <span>Subtotal</span>
                      </div>
                      <div className="sell-table-row">
                        <span>Chocolate Block</span>
                        <span>2</span>
                        <span>$1600</span>
                        <span>$3200</span>
                      </div>
                      <div className="sell-table-row">
                        <span>Coca Cola 1.25L</span>
                        <span>1</span>
                        <span>$1200</span>
                        <span>$1200</span>
                      </div>
                    </div>
                  </article>

                  <aside className="sell-summary">
                    <article className="sell-card">
                      <h2>Resumen</h2>
                      <div className="sell-summary-lines">
                        <p>
                          <span>Subtotal</span>
                          <strong>$4400</strong>
                        </p>
                        <p>
                          <span>Descuento</span>
                          <strong>$0</strong>
                        </p>
                        <p>
                          <span>Impuestos</span>
                          <strong>$0</strong>
                        </p>
                        <p className="sell-total">
                          <span>Total</span>
                          <strong>$4400</strong>
                        </p>
                      </div>
                      <div className="sell-summary-actions">
                        <button className="primary-btn" type="button">
                          Cobrar
                        </button>
                        <button className="secondary-btn" type="button">
                          Cancelar venta
                        </button>
                      </div>
                    </article>
                  </aside>
                </section>
              </section>
            ) : dashboardView === 'movimientos' ? (
              <section className="sell-panel" aria-label="Panel de movimientos">
                <header className="dashboard-header">
                  <div>
                    <h1>Movimientos</h1>
                    <p>Seccion visual para historial de ventas, ingresos y egresos.</p>
                  </div>
                </header>
                <section className="sell-cards">
                  <article className="sell-card">
                    <h2>Ultimas operaciones</h2>
                    <p>Aca se mostrara el listado de movimientos del negocio.</p>
                  </article>
                </section>
              </section>
            ) : (
              <section className="sell-panel" aria-label="Panel de configuracion">
                <header className="dashboard-header">
                  <div>
                    <h1>Configuracion</h1>
                    <p>Seccion visual para preferencias del sistema y parametros de negocio.</p>
                  </div>
                </header>
                <section className="sell-cards">
                  <article className="sell-card">
                    <h2>Ajustes generales</h2>
                    <p>Aca se podran configurar impuestos, moneda, usuarios y permisos.</p>
                  </article>
                </section>
              </section>
            )}
          </section>
        </section>

        {editingProductId !== null && (
          <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Editar producto">
            <section className="edit-modal">
              <h2>Editar producto</h2>
              <div className="form-grid">
                <input
                  placeholder="Nombre"
                  value={editForm.name}
                  onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                />
                <input
                  placeholder="Categoria"
                  value={editForm.category}
                  onChange={(event) => setEditForm({ ...editForm, category: event.target.value })}
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={editForm.price}
                  onChange={(event) => setEditForm({ ...editForm, price: Number(event.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={editForm.stock}
                  onChange={(event) => setEditForm({ ...editForm, stock: Number(event.target.value) })}
                />
                <input
                  placeholder="Imagen URL"
                  value={editForm.image}
                  onChange={(event) => setEditForm({ ...editForm, image: event.target.value })}
                />
                <input
                  placeholder="Variacion (ej: +1.2%)"
                  value={editForm.variation}
                  onChange={(event) => setEditForm({ ...editForm, variation: event.target.value })}
                />
                <input
                  placeholder="Codigo"
                  value={editForm.code}
                  onChange={(event) => setEditForm({ ...editForm, code: event.target.value })}
                />
              </div>
              <div className="header-actions">
                <button className="primary-btn" type="button" onClick={() => void guardarEdicionProducto()}>
                  Guardar cambios
                </button>
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={cancelarEdicion}
                >
                  Cancelar
                </button>
              </div>
            </section>
          </div>
        )}

        {confirmState && (
          <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Confirmar accion">
            <section className={confirmarClaseModal}>
              <h2>{confirmarTitulo}</h2>
              <p>{confirmarDescripcion}</p>
              <div className="header-actions">
                <button className={confirmarClaseBoton} type="button" onClick={() => void confirmarAccion()}>
                  {confirmarBoton}
                </button>
                <button className={cancelarBotonClase} type="button" onClick={cancelarConfirmacion}>
                  {cancelarTexto}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    )
  }

  return <LoginView onLogin={() => setIsLoggedIn(true)} />
}

export default App
