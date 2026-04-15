import type { ProductoDB } from '../types/product'
import { formatPrice, getDisplayImage, getDisplayVariation } from '../utils/productFormat'

type ProductListProps = {
  products: ProductoDB[]
  loading: boolean
}

export function ProductList({ products, loading }: ProductListProps) {
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
                <h2>{producto.name}</h2>
                <p>{producto.category || 'Sin categoria'}</p>
                <span className="stock-badge">Stock: {producto.stock}</span>
              </div>
            </div>
            <div className="market-side">
              <div className="market-meta">
                <strong>{formatPrice(producto.price)}</strong>
                <span className={isPositive ? 'change up' : 'change down'}>{variation}</span>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
