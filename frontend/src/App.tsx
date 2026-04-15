import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { LoginView } from './components/LoginView'
import { Pagination } from './components/Pagination'
import { ProductForm } from './components/ProductForm'
import { ProductList } from './components/ProductList'
import { createProduct, fetchProducts } from './services/productApi'
import { initialProductForm, type NuevoProducto, type ProductoDB } from './types/product'
import { normalizeProductForm } from './utils/productFormat'

function App() {
  const PRODUCTS_PER_PAGE = 10

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [productos, setProductos] = useState<ProductoDB[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [dashboardView, setDashboardView] = useState<'listado' | 'vender'>('listado')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<NuevoProducto>(initialProductForm)

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
    if (!sanitizedForm.name) {
      setError('El nombre del producto es obligatorio.')
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

  const totalPages = Math.max(1, Math.ceil(productos.length / PRODUCTS_PER_PAGE))
  const productosParaPaginar = useMemo(() => productos, [productos])
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
            <button
              type="button"
              className={dashboardView === 'vender' ? 'menu-btn active' : 'menu-btn'}
              onClick={() => setDashboardView('vender')}
            >
              Vender
            </button>
            <button
              type="button"
              className={dashboardView === 'listado' ? 'menu-btn active' : 'menu-btn'}
              onClick={() => setDashboardView('listado')}
            >
              Listado de productos
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

                <ProductForm
                  form={form}
                  onChange={setForm}
                  onSubmit={() => void agregarProducto()}
                  onReload={() => void loadProducts()}
                />

                {loading && <p className="status-text">Cargando productos...</p>}
                {error && <p className="error-text">{error}</p>}

                <ProductList products={productosPaginados} loading={loading} />
                <Pagination totalPages={totalPages} currentPage={currentPage} onChangePage={setCurrentPage} />
              </>
            ) : (
              <section className="sell-panel" aria-label="Panel de venta">
                <h1>Vender</h1>
                <p>Aca iria el formulario para vender productos</p>
              </section>
            )}
          </section>
        </section>
      </main>
    )
  }

  return <LoginView onLogin={() => setIsLoggedIn(true)} />
}

export default App
