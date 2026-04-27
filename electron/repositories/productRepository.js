//Repositorio para los productos

const db = require("../database");

function listProducts() {
  return db.prepare("SELECT * FROM products ORDER BY id DESC").all();
}

function createProduct(product) {
  const payload = {
    name: product.name ?? "",
    price: Number(product.price ?? 0),
    stock: Number(product.stock ?? 0),
    image: product.image ?? "",
    category: product.category ?? "",
    variation: product.variation ?? "+0.0%",
    code: product.code ?? "",
  };

  const result = db
    .prepare(
      "INSERT INTO products (name, price, stock, image, category, variation, code) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      payload.name,
      payload.price,
      payload.stock,
      payload.image,
      payload.category,
      payload.variation,
      payload.code
    );

  return {
    id: result.lastInsertRowid,
    ...payload,
  };
}

function updateProduct(id, product) {
  const payload = {
    name: product.name ?? "",
    price: Number(product.price ?? 0),
    stock: Number(product.stock ?? 0),
    image: product.image ?? "",
    category: product.category ?? "",
    variation: product.variation ?? "+0.0%",
    code: product.code ?? "",
  };

  const result = db
    .prepare(
      "UPDATE products SET name = ?, price = ?, stock = ?, image = ?, category = ?, variation = ?, code = ? WHERE id = ?"
    )
    .run(
      payload.name,
      payload.price,
      payload.stock,
      payload.image,
      payload.category,
      payload.variation,
      payload.code,
      Number(id)
    );

  if (result.changes === 0) {
    return null;
  }

  return {
    id: Number(id),
    ...payload,
  };
}

function deleteProduct(id) {
  const result = db
    .prepare("DELETE FROM products WHERE id = ?")
    .run(Number(id));

  return result.changes > 0;
}

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
