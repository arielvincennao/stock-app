const db = require("../database");

function listMovements() {
  return db.prepare("SELECT * FROM movements ORDER BY id DESC").all();
}

function createMovement(movement) {
  const payload = {
    createdAt: movement.createdAt ?? new Date().toISOString(),
    paymentMethod: movement.paymentMethod ?? "Efectivo",
    itemsCount: Number(movement.itemsCount ?? 0),
    subtotal: Number(movement.subtotal ?? 0),
    discountPercent: Number(movement.discountPercent ?? 0),
    discountAmount: Number(movement.discountAmount ?? 0),
    total: Number(movement.total ?? 0),
  };

  const result = db
    .prepare(
      "INSERT INTO movements (createdAt, paymentMethod, itemsCount, subtotal, discountPercent, discountAmount, total) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      payload.createdAt,
      payload.paymentMethod,
      payload.itemsCount,
      payload.subtotal,
      payload.discountPercent,
      payload.discountAmount,
      payload.total
    );

  return {
    id: Number(result.lastInsertRowid),
    ...payload,
  };
}

module.exports = {
  listMovements,
  createMovement,
};
