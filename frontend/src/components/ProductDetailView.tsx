import { SectionHeader } from './SectionHeader'

type ProductDetailViewProps = {
  productName: string
  onBack: () => void
}

export function ProductDetailView({ productName, onBack }: ProductDetailViewProps) {
  return (
    <section className="sell-panel" aria-label="Detalle de producto">
      <SectionHeader
        title={`Viendo detalles de ${productName}`}
        description=""
        action={
          <button className="secondary-btn" type="button" onClick={onBack}>
            Volver
          </button>
        }
      />
    </section>
  )
}
