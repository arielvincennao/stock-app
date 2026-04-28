import type { NuevoProducto } from '../types/product'

type ProductFormProps = {
  form: NuevoProducto
  onChange: (next: NuevoProducto) => void
  onSubmit: () => void
  onPickImage: () => void
}

export function ProductForm({ form, onChange, onSubmit, onPickImage }: ProductFormProps) {
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
          placeholder="Ruta local de imagen"
          value={form.image}
          readOnly
        />
        <button className="secondary-btn" type="button" onClick={onPickImage}>
          Seleccionar imagen
        </button>
        <input
          placeholder="Codigo"
          value={form.code}
          onChange={(event) => onChange({ ...form, code: event.target.value })}
        />
        <input
          placeholder="Variacion (ej: +1.2%)"
          value={form.variation}
          onChange={(event) => onChange({ ...form, variation: event.target.value })}
        />
      </div>
      <div className="header-actions">
        <button className="primary-btn" type="button" onClick={onSubmit}>
          Guardar producto
        </button>
      </div>
    </section>
  )
}
