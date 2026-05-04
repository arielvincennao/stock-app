const db = require("../database");

function listMovements() {
  return db.prepare("SELECT * FROM movements ORDER BY id DESC").all();
}

function getMovementDetail(id) {
  const movementId = Number(id);
  const movement = db.prepare("SELECT * FROM movements WHERE id = ?").get(movementId);
  if (!movement) {
    return null;
  }
  const items = db
    .prepare(
      "SELECT id, movementId, productId, productName, unitPrice, quantity FROM movement_items WHERE movementId = ? ORDER BY id ASC"
    )
    .all(movementId);
  return { ...movement, items };
}

function createMovement(movement) {
  const items = Array.isArray(movement.items) ? movement.items : [];
  const payload = {
    createdAt: movement.createdAt ?? new Date().toISOString(),
    paymentMethod: movement.paymentMethod ?? "Efectivo",
    itemsCount: Number(movement.itemsCount ?? 0),
    subtotal: Number(movement.subtotal ?? 0),
    discountPercent: Number(movement.discountPercent ?? 0),
    discountAmount: Number(movement.discountAmount ?? 0),
    total: Number(movement.total ?? 0),
  };

  const insertMovement = db.prepare(
    "INSERT INTO movements (createdAt, paymentMethod, itemsCount, subtotal, discountPercent, discountAmount, total) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  const insertItem = db.prepare(
    "INSERT INTO movement_items (movementId, productId, productName, unitPrice, quantity) VALUES (?, ?, ?, ?, ?)"
  );

  const transaction = db.transaction(() => {
    const result = insertMovement.run(
      payload.createdAt,
      payload.paymentMethod,
      payload.itemsCount,
      payload.subtotal,
      payload.discountPercent,
      payload.discountAmount,
      payload.total
    );
    const newId = Number(result.lastInsertRowid);

    for (const item of items) {
      insertItem.run(
        newId,
        Number(item.productId ?? 0),
        String(item.productName ?? ""),
        Number(item.unitPrice ?? 0),
        Number(item.quantity ?? 0)
      );
    }

    return {
      id: newId,
      ...payload,
    };
  });

  return transaction();
}

function deleteMovement(id) {
  const movementId = Number(id);
  const result = db.prepare("DELETE FROM movements WHERE id = ?").run(movementId);
  return result.changes > 0;
}

module.exports = {
  listMovements,
  getMovementDetail,
  createMovement,
  deleteMovement,
};
