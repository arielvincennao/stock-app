export type DashboardView = 'listado' | 'crear' | 'detalle' | 'vender' | 'movimientos' | 'configuracion'

type DashboardMenuProps = {
  currentView: DashboardView
  onNavigate: (view: DashboardView) => void
  onCreateProduct: () => void
}

export function DashboardMenu({ currentView, onNavigate, onCreateProduct }: DashboardMenuProps) {
  return (
    <aside className="dashboard-menu">
      <p className="login-kicker">Stock App</p>
      <p className="menu-section-title">OPERACION</p>
      <button type="button" className={currentView === 'vender' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('vender')}>
        Vender
      </button>
      <button
        type="button"
        className={currentView === 'listado' || currentView === 'crear' ? 'menu-btn active' : 'menu-btn'}
        onClick={() => onNavigate('listado')}
      >
        Productos
      </button>
      <button type="button" className={currentView === 'crear' ? 'menu-btn active' : 'menu-btn'} onClick={onCreateProduct}>
        Crear producto
      </button>

      <p className="menu-section-title">CONTROL</p>
      <button type="button" className={currentView === 'movimientos' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('movimientos')}>
        Movimientos
      </button>

      <p className="menu-section-title">SISTEMA</p>
      <button type="button" className={currentView === 'configuracion' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('configuracion')}>
        Configuracion
      </button>
    </aside>
  )
}
