import type { NuevoProducto } from '../types/product'

type EditProductModalProps = {
  form: NuevoProducto
  onChange: (next: NuevoProducto) => void
  onPickImage: () => void
  onSave: () => void
  onCancel: () => void
}

export function EditProductModal({ form, onChange, onPickImage, onSave, onCancel }: EditProductModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Editar producto">
      <section className="edit-modal">
        <h2>Editar producto</h2>
        <div className="form-grid">
          <input placeholder="Nombre" value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} />
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
          <input placeholder="Ruta local de imagen" value={form.image} readOnly />
          <button className="secondary-btn" type="button" onClick={onPickImage}>
            Seleccionar imagen
          </button>
          <input
            placeholder="Variacion (ej: +1.2%)"
            value={form.variation}
            onChange={(event) => onChange({ ...form, variation: event.target.value })}
          />
          <input placeholder="Codigo" value={form.code} onChange={(event) => onChange({ ...form, code: event.target.value })} />
        </div>
        <div className="header-actions">
          <button className="primary-btn" type="button" onClick={onSave}>
            Guardar cambios
          </button>
          <button className="secondary-btn" type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </section>
    </div>
  )
}
