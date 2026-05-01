export type DashboardView = 'listado' | 'detalle' | 'vender' | 'movimientos' | 'alertas' | 'configuracion'

type DashboardMenuProps = {
  currentView: DashboardView
  onNavigate: (view: DashboardView) => void
  alertsCount: number
}

export function DashboardMenu({ currentView, onNavigate, alertsCount }: DashboardMenuProps) {
  return (
    <aside className="dashboard-menu">
      <p className="login-kicker">Stock App - Prueba gratuita</p>
      <p className="menu-section-title">OPERACION</p>
      <button type="button" className={currentView === 'vender' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('vender')}>
        Vender
      </button>
      <button
        type="button"
        className={currentView === 'listado' ? 'menu-btn active' : 'menu-btn'}
        onClick={() => onNavigate('listado')}
      >
        Productos
      </button>
      <p className="menu-section-title">CONTROL</p>
      <button type="button" className={currentView === 'movimientos' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('movimientos')}>
        Movimientos
      </button>
      <button type="button" className={currentView === 'alertas' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('alertas')}>
        <span>Alertas</span>
        <span className="menu-alert-count">{alertsCount}</span>
      </button>

      <p className="menu-section-title">SISTEMA</p>
      <button type="button" className={currentView === 'configuracion' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('configuracion')}>
        Configuracion
      </button>
    </aside>
  )
}
