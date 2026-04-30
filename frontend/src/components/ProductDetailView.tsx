import { SectionHeader } from './SectionHeader'
import type { ProductoDB } from '../types/product'
import { formatPrice, getDisplayImage, getDisplayVariation } from '../utils/productFormat'

type ProductDetailViewProps = {
  product: ProductoDB | null
  onBack: () => void
}

function parseVariation(variation: string) {
  const normalized = variation.replace('%', '').replace(',', '.')
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function ProductDetailView({ product, onBack }: ProductDetailViewProps) {
  if (!product) {
    return (
      <section className="product-detail-panel" aria-label="Detalle de producto">
        <SectionHeader
          title="Detalle de producto"
          description="Selecciona un producto desde el listado para ver su informacion."
          action={
            <button className="secondary-btn" type="button" onClick={onBack}>
              Volver
            </button>
          }
        />
      </section>
    )
  }

  const variation = getDisplayVariation(product)
  const variationValue = parseVariation(variation)
  const isVariationUp = variationValue >= 0
  const stockStatus =
    product.stock <= 0 ? 'Sin stock' : product.stock <= 5 ? 'Stock bajo' : product.stock <= 20 ? 'Stock medio' : 'Stock alto'
  const stockStatusClass =
    product.stock <= 0
      ? 'product-detail-badge danger'
      : product.stock <= 5
        ? 'product-detail-badge warning'
        : 'product-detail-badge success'
  const inventoryValue = product.price * product.stock
  const image = getDisplayImage(product)
  const category = product.category || 'Sin categoria'
  const code = product.code || 'No definido'

  return (
    <section className="product-detail-panel" aria-label="Detalle de producto">
      <SectionHeader
        title={product.name}
        description="Informacion comercial y operativa del producto seleccionado."
        action={
          <button className="secondary-btn" type="button" onClick={onBack}>
            Volver
          </button>
        }
      />

      <div className="product-detail-layout">
        <article className="product-detail-card product-detail-main">
          <img className="product-detail-image" src={image} alt={product.name} />
          <div className="product-detail-main-info">
            <p className="product-detail-kicker">{category}</p>
            <h2>{product.name}</h2>
            <div className="product-detail-tags">
              <span className={stockStatusClass}>{stockStatus}</span>
              <span className={isVariationUp ? 'change up' : 'change down'}>{variation}</span>
            </div>
            <p className="product-detail-price">{formatPrice(product.price)}</p>
            <p className="product-detail-code">Codigo: {code}</p>
          </div>
        </article>

        <article className="product-detail-card">
          <h3>Informacion adicional</h3>
          <div className="product-detail-metrics">
            <p>
              <span>Stock actual</span>
              <strong>{product.stock} unidades</strong>
            </p>
            <p>
              <span>Valor de inventario</span>
              <strong>{formatPrice(inventoryValue)}</strong>
            </p>
            <p>
              <span>Categoria</span>
              <strong>{category}</strong>
            </p>
            <p>
              <span>Codigo interno</span>
              <strong>{code}</strong>
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}
