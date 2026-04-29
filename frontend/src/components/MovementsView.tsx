import type { MovementDB } from '../services/productApi'

type MovementsViewProps = {
  movements: MovementDB[]
  formatCurrency: (value: number) => string
}

export function MovementsView({ movements, formatCurrency }: MovementsViewProps) {
  return (
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
          {movements.length === 0 ? (
            <p>Aun no hay movimientos registrados.</p>
          ) : (
            <div className="sell-table">
              <div className="sell-table-head sell-movements-head">
                <span>Fecha</span>
                <span>Pago</span>
                <span>Items</span>
                <span>Desc.</span>
                <span>Total</span>
              </div>
              {movements.map((movement) => (
                <div className="sell-table-row sell-movements-row" key={movement.id}>
                  <span>{new Date(movement.createdAt).toLocaleString('es-AR')}</span>
                  <span>{movement.paymentMethod}</span>
                  <span>{movement.itemsCount}</span>
                  <span>{movement.discountPercent.toFixed(2)}%</span>
                  <span>{formatCurrency(movement.total)}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </section>
  )
}
