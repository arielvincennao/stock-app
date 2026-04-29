import { SectionHeader } from './SectionHeader'

export function SettingsView() {
  return (
    <section className="sell-panel" aria-label="Panel de configuracion">
      <SectionHeader
        title="Configuracion"
        description="Seccion visual para preferencias del sistema y parametros de negocio."
      />
      <section className="sell-cards">
        <article className="sell-card">
          <h2>Ajustes generales</h2>
          <p>Aca se podran configurar impuestos, moneda, usuarios y permisos.</p>
        </article>
      </section>
    </section>
  )
}
