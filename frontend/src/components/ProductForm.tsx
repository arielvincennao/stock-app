import type { NuevoProducto } from '../types/product'

type ProductFormProps = {
  form: NuevoProducto
  onChange: (next: NuevoProducto) => void
  onSubmit: () => void
  onReload: () => void
}

export function ProductForm({ form, onChange, onSubmit, onReload }: ProductFormProps) {
  return (
    <section className="new-product-form" aria-label="Crear nuevo producto">
      <h2>Crear producto</h2>
      <div className="form-grid">
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
        />
        <input
          placeholder="Categoria"
          value={form.category}
          onChange={(event) => onChange({ ...form, category: event.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(event) => onChange({ ...form, price: Number(event.target.value) })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(event) => onChange({ ...form, stock: Number(event.target.value) })}
        />
        <input
          placeholder="Imagen URL"
          value={form.image}
          onChange={(event) => onChange({ ...form, image: event.target.value })}
        />
        <input
          placeholder="Codigo"
          value={form.code}
          onChange={(event) => onChange({ ...form, code: event.target.value })}
        />
      </div>
      <div className="header-actions">
        <button className="primary-btn" type="button" onClick={onSubmit}>
          Guardar producto
        </button>
        <button className="secondary-btn" type="button" onClick={onReload}>
          Recargar lista
        </button>
      </div>
    </section>
  )
}
