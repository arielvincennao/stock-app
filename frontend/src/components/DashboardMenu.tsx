import type { ReactNode } from 'react'
import logoTenva from '../assets/icons/tenva.png'

export type DashboardView =
  | 'listado'
  | 'detalle'
  | 'vender'
  | 'movimientos'
  | 'alertas'
  | 'configuracion'
  | 'ayuda'

type DashboardMenuProps = {
  currentView: DashboardView
  onNavigate: (view: DashboardView) => void
  alertsCount: number
  onLogout: () => void
}

function MenuIcon({ children }: { children: ReactNode }) {
  return (
    <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  )
}

export function DashboardMenu({ currentView, onNavigate, alertsCount, onLogout }: DashboardMenuProps) {
  return (
    <aside className="dashboard-menu">
      <div className="dashboard-menu-brand">
        <img className="dashboard-menu-logo" src={logoTenva} alt="Tenva" />
      </div>
      <div className="dashboard-menu-body">
      <p className="menu-section-title">OPERACION</p>
      <button type="button" className={currentView === 'vender' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('vender')}>
        <span className="menu-btn-label">
          <MenuIcon>
            <path
              d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="21" r="1.5" fill="currentColor" />
            <circle cx="19" cy="21" r="1.5" fill="currentColor" />
          </MenuIcon>
          Vender
        </span>
      </button>
      <button
        type="button"
        className={currentView === 'listado' ? 'menu-btn active' : 'menu-btn'}
        onClick={() => onNavigate('listado')}
      >
        <span className="menu-btn-label">
          <MenuIcon>
            <path
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </MenuIcon>
          Productos
        </span>
      </button>
      <p className="menu-section-title">CONTROL</p>
      <button type="button" className={currentView === 'movimientos' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('movimientos')}>
        <span className="menu-btn-label">
          <MenuIcon>
            <path
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </MenuIcon>
          Movimientos
        </span>
      </button>
      <button type="button" className={currentView === 'alertas' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('alertas')}>
        <span className="menu-btn-label">
          <MenuIcon>
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </MenuIcon>
          Alertas
        </span>
        <span className="menu-alert-count">{alertsCount}</span>
      </button>

      <p className="menu-section-title">SISTEMA</p>
      <button type="button" className={currentView === 'configuracion' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('configuracion')}>
        <span className="menu-btn-label">
          <MenuIcon>
            <path
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </MenuIcon>
          Configuracion
        </span>
      </button>
      <button type="button" className={currentView === 'ayuda' ? 'menu-btn active' : 'menu-btn'} onClick={() => onNavigate('ayuda')}>
        <span className="menu-btn-label">
          <MenuIcon>
            <path
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </MenuIcon>
          Ayuda
        </span>
      </button>
      </div>
      <div className="menu-logout-block">
        <button type="button" className="menu-btn menu-btn-logout" onClick={onLogout}>
          <span className="menu-btn-label">
            <MenuIcon>
              <path
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </MenuIcon>
            Cerrar sesion
          </span>
        </button>
      </div>
    </aside>
  )
}
