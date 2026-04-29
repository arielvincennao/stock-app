type ConfirmModalProps = {
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  confirmClassName: string
  cancelClassName: string
  modalClassName: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmClassName,
  cancelClassName,
  modalClassName,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Confirmar accion">
      <section className={modalClassName}>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="header-actions">
          <button className={confirmClassName} type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className={cancelClassName} type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
