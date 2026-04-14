import { useState } from 'react'
import './App.css'
import { productosMercado, type ProductoMercado } from './data/productos'

function App() {
  const PRODUCTS_PER_PAGE = 10
  const MIN_TOTAL_PAGES = 4

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [productos, setProductos] = useState(productosMercado)
  const [currentPage, setCurrentPage] = useState(1)
  const [dashboardView, setDashboardView] = useState<'listado' | 'vender'>('listado')

  const agregarProducto = () => {
    const nuevoProducto: ProductoMercado = {
      id: String(Date.now()),
      nombre: 'Producto nuevo',
      categoria: 'Sin categoria',
      precio: '$ 0',
      variacion: '+0.0%',
      imagen: 'https://images.unsplash.com/photo-1584473457493-17c6f0d35f89?auto=format&fit=crop&w=200&q=80',
      stock: 0,
    }
    setProductos((prev) => [nuevoProducto, ...prev])
  }

  const totalPages = Math.max(MIN_TOTAL_PAGES, Math.ceil(productos.length / PRODUCTS_PER_PAGE))
  const totalItemsNeeded = totalPages * PRODUCTS_PER_PAGE
  const productosParaPaginar =
    productos.length === 0
      ? []
      : Array.from({ length: totalItemsNeeded }, (_, index) => {
          const productoBase = productos[index % productos.length]
          return {
            ...productoBase,
            id: `${productoBase.id}-page-${index}`,
          }
        })
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
                    <p>Visualiza rapidamente precios y variaciones de los productos destacados.</p>
                  </div>
                  <div className="header-actions">
                    <button className="primary-btn" type="button" onClick={agregarProducto}>
                      Agregar producto
                    </button>
                  </div>
                </header>

                <section className="market-list" aria-label="Listado de productos">
                  {productosPaginados.map((producto) => {
                    const isPositive = producto.variacion.startsWith('+')
                    return (
                      <article className="market-item" key={producto.id}>
                        <div className="market-main">
                          <img className="market-image" src={producto.imagen} alt={producto.nombre} />
                          <div>
                            <h2>{producto.nombre}</h2>
                            <p>{producto.categoria}</p>
                            <span className="stock-badge">Stock: {producto.stock}</span>
                          </div>
                        </div>
                        <div className="market-side">
                          <div className="market-meta">
                            <strong>{producto.precio}</strong>
                            <span className={isPositive ? 'change up' : 'change down'}>{producto.variacion}</span>
                          </div>
                          <div className="market-actions">
                            <button type="button" className="item-btn edit-btn">
                              Modificar
                            </button>
                            <button type="button" className="item-btn delete-btn">
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </section>
                <nav className="pagination" aria-label="Paginado de productos">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={pageNumber === currentPage ? 'page-btn active' : 'page-btn'}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </nav>
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

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-header">
          <p className="login-kicker">Stock App</p>
          <h1 id="login-title">Acceso al sistema</h1>
        </div>
        <form className="login-form" onSubmit={(event) => {
          event.preventDefault()
          setIsLoggedIn(true)
        }}>
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" placeholder="tu@email.com" />

          <label htmlFor="password">Contrasena</label>
          <input id="password" name="password" type="password" placeholder="********" />

          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  )
}

export default App
