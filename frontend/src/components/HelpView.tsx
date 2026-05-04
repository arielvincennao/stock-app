import { SectionHeader } from './SectionHeader'

export function HelpView() {
  return (
    <section className="sell-panel" aria-label="Ayuda">
      <SectionHeader
        title="Ayuda"
        description="Guia rapida del panel de stock y ventas."
      />
      <section className="sell-cards">
        <article className="sell-card">
          <h2>Uso del sistema</h2>
          <p>
            Desde el menu lateral podes vender, administrar productos, ver movimientos, alertas y configuracion. La busqueda
            en ventas filtra por nombre o codigo; las sugerencias aparecen al escribir.
          </p>
        </article>
      </section>
    </section>
  )
}
