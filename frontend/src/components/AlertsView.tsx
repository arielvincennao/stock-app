type AlertSeverity = 'alta' | 'media' | 'baja'

type AlertItem = {
  id: number
  title: string
  description: string
  severity: AlertSeverity
  time: string
}

export const mockAlerts: AlertItem[] = [
  {
    id: 1,
    title: 'Stock critico en Gaseosa Cola 2.25L',
    description: 'Quedan 2 unidades. Se recomienda reponer hoy.',
    severity: 'alta',
    time: 'Hace 5 min',
  },
  {
    id: 2,
    title: 'Producto sin ventas recientes',
    description: 'Papas Clasicas 100g no registra ventas hace 14 dias.',
    severity: 'media',
    time: 'Hace 1 hora',
  },
  {
    id: 3,
    title: 'Precio pendiente de revision',
    description: 'Yerba Tradicional 500g tiene costo actualizado y margen bajo.',
    severity: 'baja',
    time: 'Ayer',
  },
]

export function AlertsView() {
  return (
    <section className="alerts-panel" aria-label="Panel de alertas">
      <header className="dashboard-header">
        <div>
          <h1>Alertas</h1>
          <p>Vista preliminar de alertas operativas del negocio.</p>
        </div>
      </header>

      <section className="alerts-list">
        {mockAlerts.map((alert) => (
          <article className={`alert-card alert-${alert.severity}`} key={alert.id}>
            <div className="alert-card-head">
              <strong>{alert.title}</strong>
              <span>{alert.time}</span>
            </div>
            <p>{alert.description}</p>
            <span className={`alert-badge alert-badge-${alert.severity}`}>
              {alert.severity === 'alta' ? 'Prioridad alta' : alert.severity === 'media' ? 'Prioridad media' : 'Prioridad baja'}
            </span>
          </article>
        ))}
      </section>
    </section>
  )
}
