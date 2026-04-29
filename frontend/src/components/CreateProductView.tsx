import { ProductForm } from './ProductForm'
import { SectionHeader } from './SectionHeader'
import type { NuevoProducto } from '../types/product'

type CreateProductViewProps = {
  error: string
  form: NuevoProducto
  onChange: (next: NuevoProducto) => void
  onSubmit: () => void
  onPickImage: () => void
}

export function CreateProductView({ error, form, onChange, onSubmit, onPickImage }: CreateProductViewProps) {
  return (
    <>
      <SectionHeader title="Crear producto" description="Crea y guarda nuevos productos en SQLite (database.db)." />
      {error && <p className="error-text">{error}</p>}
      <ProductForm form={form} onChange={onChange} onSubmit={onSubmit} onPickImage={onPickImage} />
    </>
  )
}
