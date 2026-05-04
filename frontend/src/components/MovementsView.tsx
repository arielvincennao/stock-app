import { useCallback, useEffect, useState } from 'react'
import { ConfirmModal } from './ConfirmModal'
import type { MovementDB, MovementDetailDB } from '../services/productApi'

function movementDetailToRow(detail: MovementDetailDB): MovementDB {
  return {
    id: detail.id,
    createdAt: detail.createdAt,
    paymentMethod: detail.paymentMethod,
    itemsCount: detail.itemsCount,
    subtotal: detail.subtotal,
    discountPercent: detail.discountPercent,
    discountAmount: detail.discountAmount,
    total: detail.total,
  }
}

type MovementsViewProps = {
  movements: MovementDB[]
  formatCurrency: (value: number) => string
  fetchMovementDetail: (id: number) => Promise<MovementDetailDB | null>
  onDeleteMovement: (id: number) => Promise<boolean>
}

export function MovementsView({
  movements,
  formatCurrency,
  fetchMovementDetail,
  onDeleteMovement,
}: MovementsViewProps) {
  const [openMovementId, setOpenMovementId] = useState<number | null>(null)
  const [detail, setDetail] = useState<MovementDetailDB | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [pendingDelete, setPendingDelete] = useState<MovementDB | null>(null)

  const closeDetail = useCallback(() => {
    setOpenMovementId(null)
    setDetail(null)
    setDetailError('')
    setDetailLoading(false)
  }, [])

  useEffect(() => {
    if (openMovementId === null) return

    let cancelled = false
    setDetailLoading(true)
    setDetailError('')
    setDetail(null)

    void fetchMovementDetail(openMovementId)
      .then((data) => {
        if (cancelled) return
        if (!data) {
          setDetailError('No se encontro el movimiento.')
          return
        }
        setDetail(data)
      })
      .catch(() => {
        if (!cancelled) {
          setDetailError('No se pudo cargar el detalle.')
        }
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [openMovementId, fetchMovementDetail])

  useEffect(() => {
    if (openMovementId === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDetail()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openMovementId, closeDetail])

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    const id = pendingDelete.id
    const ok = await onDeleteMovement(id)
    if (ok) {
      setPendingDelete(null)
      if (openMovementId === id) closeDetail()
    }
  }

  return (
    <section className="sell-panel" aria-label="Panel de movimientos">
      <header className="dashboard-header">
        <div>
          <h1>Movimientos</h1>
          <p>Seccion visual para historial de ventas, ingresos y egresos.</p>
        </div>
      </header>
      <section className="sell-cards">
        <article className="sell-card">
          <h2>Ultimas operaciones</h2>
          {movements.length === 0 ? (
            <p>Aun no hay movimientos registrados.</p>
          ) : (
            <div className="sell-table">
              <div className="sell-table-head sell-movements-head">
                <span>Fecha</span>
                <span>Pago</span>
                <span>Items</span>
                <span>Desc.</span>
                <span>Total</span>
                <span className="sell-movements-actions-head" aria-hidden="true" />
              </div>
              {movements.map((movement) => (
                <div className="sell-table-row sell-movements-row" key={movement.id}>
                  <span>{new Date(movement.createdAt).toLocaleString('es-AR')}</span>
                  <span>{movement.paymentMethod}</span>
                  <span>{movement.itemsCount}</span>
                  <span>{movement.discountPercent.toFixed(2)}%</span>
                  <span>{formatCurrency(movement.total)}</span>
                  <span className="sell-movements-actions-cell">
                    <span className="sell-movements-action-btns">
                      <button
                        type="button"
                        className="secondary-btn movement-detail-btn"
                        onClick={() => setOpenMovementId(movement.id)}
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        className="item-btn delete-btn movement-delete-btn"
                        onClick={() => setPendingDelete(movement)}
                      >
                        Eliminar
                      </button>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      {openMovementId !== null && (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDetail()
          }}
        >
          <div
            className="edit-modal movement-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="movement-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="movement-detail-title">Detalle del movimiento</h2>

            {detailLoading && <p className="movement-detail-status">Cargando...</p>}
            {!detailLoading && detailError && (
              <p className="movement-detail-status movement-detail-error">{detailError}</p>
            )}

            {!detailLoading && detail && (
              <>
                <div className="movement-detail-meta">
                  <p>
                    <strong>Fecha:</strong> {new Date(detail.createdAt).toLocaleString('es-AR')}
                  </p>
                  <p>
                    <strong>Pago:</strong> {detail.paymentMethod}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> {formatCurrency(detail.subtotal)}
                  </p>
                  <p>
                    <strong>Descuento ({detail.discountPercent.toFixed(2)}%):</strong>{' '}
                    {formatCurrency(detail.discountAmount)}
                  </p>
                  <p>
                    <strong>Total:</strong> {formatCurrency(detail.total)}
                  </p>
                  <p>
                    <strong>Unidades vendidas:</strong> {detail.itemsCount}
                  </p>
                </div>

                {detail.items.length === 0 ? (
                  <p className="movement-detail-empty-lines">
                    No hay lineas de producto guardadas para este movimiento (ventas anteriores a esta funcion).
                  </p>
                ) : (
                  <div className="sell-table movement-detail-lines">
                    <div className="sell-table-head movement-detail-lines-head">
                      <span>Producto</span>
                      <span>P. unit.</span>
                      <span>Cant.</span>
                      <span>Subt.</span>
                    </div>
                    {detail.items.map((line) => (
                      <div className="sell-table-row movement-detail-lines-row" key={line.id}>
                        <span className="movement-detail-product-name">{line.productName}</span>
                        <span>{formatCurrency(line.unitPrice)}</span>
                        <span>{line.quantity}</span>
                        <span>{formatCurrency(line.unitPrice * line.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="movement-detail-footer movement-detail-footer-split">
                  <button
                    type="button"
                    className="item-btn delete-btn"
                    onClick={() => setPendingDelete(movementDetailToRow(detail))}
                  >
                    Eliminar registro
                  </button>
                  <button type="button" className="primary-btn" onClick={closeDetail}>
                    Cerrar
                  </button>
                </div>
              </>
            )}

            {!detailLoading && !detail && (
              <div className="movement-detail-footer">
                <button type="button" className="primary-btn" onClick={closeDetail}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {pendingDelete && (
        <ConfirmModal
          title="Eliminar movimiento?"
          description={`Se quitara el registro del ${new Date(pendingDelete.createdAt).toLocaleString('es-AR')} (${formatCurrency(pendingDelete.total)}). Esta accion no se puede deshacer.`}
          confirmLabel="Si, eliminar"
          cancelLabel="Cancelar"
          confirmClassName="item-btn delete-btn"
          cancelClassName="secondary-btn"
          modalClassName="confirm-modal confirm-delete"
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </section>
  )
}
