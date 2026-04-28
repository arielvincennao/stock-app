import type { ProductoDB } from '../types/product'
import { formatPrice, getDisplayImage, getDisplayVariation } from '../utils/productFormat'

type ProductListProps = {
  products: ProductoDB[]
  loading: boolean
  onEdit: (product: ProductoDB) => void
  onDelete: (product: ProductoDB) => void
  onDetails: (product: ProductoDB) => void
}

export function ProductList({ products, loading, onEdit, onDelete, onDetails }: ProductListProps) {
  return (
    <section className="market-list" aria-label="Listado de productos">
      {!loading && products.length === 0 && <p className="status-text">No hay productos cargados.</p>}
      {products.map((producto) => {
        const variation = getDisplayVariation(producto)
        const image = getDisplayImage(producto)
        const isPositive = variation.startsWith('+')

        return (
          <article className="market-item" key={producto.id}>
            <div className="market-main">
              <img className="market-image" src={image} alt={producto.name} />
              <div>
                <h2
                  role="button"
                  tabIndex={0}
                  onClick={() => onDetails(producto)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onDetails(producto)
                    }
                  }}
                >
                  {producto.name}
                </h2>
                <p>{producto.category || 'Sin categoria'}</p>
                <span className="stock-badge">Stock: {producto.stock}</span>
              </div>
            </div>
            <div className="market-side">
              <div className="market-meta">
                <strong>{formatPrice(producto.price)}</strong>
                <span className={isPositive ? 'change up' : 'change down'}>{variation}</span>
              </div>
              <div className="market-actions">
                <button className="item-btn" type="button" onClick={() => onDetails(producto)}>
                  Detalles
                </button>
                <button className="item-btn edit-btn" type="button" onClick={() => onEdit(producto)}>
                  Editar
                </button>
                <button className="item-btn delete-btn" type="button" onClick={() => onDelete(producto)}>
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
