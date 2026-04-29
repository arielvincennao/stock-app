import type { ProductoDB } from '../types/product'

export type SaleCartItem = {
  productId: number
  name: string
  unitPrice: number
  quantity: number
}

type SellViewProps = {
  paymentMethod: string
  discountPercent: string
  productQuery: string
  productQuantity: string
  suggestions: ProductoDB[]
  cart: SaleCartItem[]
  subtotal: number
  discountAmount: number
  total: number
  saleMessage: string
  onPaymentMethodChange: (value: string) => void
  onDiscountPercentChange: (value: string) => void
  onProductQueryChange: (value: string) => void
  onProductQuantityChange: (value: string) => void
  onAddProduct: () => void
  onSuggestionSelect: (suggestion: ProductoDB) => void
  onRemoveCartItem: (productId: number) => void
  onCharge: () => void
  onCancelSale: () => void
  formatCurrency: (value: number) => string
}

export function SellView({
  paymentMethod,
  discountPercent,
  productQuery,
  productQuantity,
  suggestions,
  cart,
  subtotal,
  discountAmount,
  total,
  saleMessage,
  onPaymentMethodChange,
  onDiscountPercentChange,
  onProductQueryChange,
  onProductQuantityChange,
  onAddProduct,
  onSuggestionSelect,
  onRemoveCartItem,
  onCharge,
  onCancelSale,
  formatCurrency,
}: SellViewProps) {
  return (
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
              <span>Metodo de pago</span>
              <select value={paymentMethod} onChange={(event) => onPaymentMethodChange(event.target.value)}>
                <option>Efectivo</option>
                <option>Debito</option>
                <option>Credito</option>
                <option>Transferencia</option>
              </select>
            </label>
            <label className="sell-field">
              <span>Descuento</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={discountPercent}
                onChange={(event) => onDiscountPercentChange(event.target.value)}
              />
            </label>
          </div>
        </article>

        <article className="sell-card sell-card-main">
          <h2>Agregar producto</h2>
          <div className="sell-add-row">
            <input
              type="text"
              placeholder="Buscar producto por nombre o codigo"
              value={productQuery}
              onChange={(event) => onProductQueryChange(event.target.value)}
            />
            <input
              type="number"
              min="1"
              value={productQuantity}
              onChange={(event) => onProductQuantityChange(event.target.value)}
            />
            <button className="primary-btn" type="button" onClick={onAddProduct}>
              Agregar
            </button>
          </div>
          {suggestions.length > 0 && (
            <div className="sale-suggestions" role="listbox" aria-label="Sugerencias de productos">
              {suggestions.map((suggestion) => (
                <button
                  className="sale-suggestion-item"
                  key={suggestion.id}
                  type="button"
                  onClick={() => onSuggestionSelect(suggestion)}
                >
                  <span>{suggestion.name}</span>
                  <small>
                    Cod: {suggestion.code || '-'} | Stock: {suggestion.stock}
                  </small>
                </button>
              ))}
            </div>
          )}
        </article>

        <article className="sell-card sell-card-main">
          <h2>Detalle</h2>
          <div className="sell-table">
            <div className="sell-table-head">
              <span>Producto</span>
              <span>Cant.</span>
              <span>P. unitario</span>
              <span>Subtotal</span>
              <span>Accion</span>
            </div>
            {cart.length === 0 ? (
              <p className="status-text">No hay productos en el carrito.</p>
            ) : (
              cart.map((item) => (
                <div className="sell-table-row" key={item.productId}>
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                  <span>{formatCurrency(item.unitPrice)}</span>
                  <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                  <button className="item-btn delete-btn" type="button" onClick={() => onRemoveCartItem(item.productId)}>
                    Quitar
                  </button>
                </div>
              ))
            )}
          </div>
        </article>

        <aside className="sell-summary">
          <article className="sell-card">
            <h2>Resumen</h2>
            <div className="sell-summary-lines">
              <p>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </p>
              <p>
                <span>Descuento</span>
                <strong>-{formatCurrency(discountAmount)}</strong>
              </p>
              <p>
                <span>Impuestos</span>
                <strong>$0</strong>
              </p>
              <p className="sell-total">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </p>
            </div>
            <div className="sell-summary-actions">
              <button className="primary-btn" type="button" onClick={onCharge}>
                Cobrar
              </button>
              <button className="secondary-btn" type="button" onClick={onCancelSale}>
                Cancelar venta
              </button>
            </div>
            {saleMessage && <p className="status-text">{saleMessage}</p>}
          </article>
        </aside>
      </section>
    </section>
  )
}
