//Repositorio para los productos

const db = require("../database");
const fs = require("fs");
const path = require("path");

const DEFAULT_PRODUCT_IMAGE = path.join(__dirname, "..", "data", "product-images", "default-product.jpg");
const PRODUCT_IMAGES_DIR = path.join(__dirname, "..", "data", "product-images");

function toFilesystemPath(value) {
  if (typeof value !== "string") {
    return "";
  }

  const raw = value.trim();
  if (!raw) {
    return "";
  }

  if (!/^file:\/\//i.test(raw)) {
    return raw;
  }

  let normalized = decodeURI(raw.replace(/^file:\/+/i, ""));
  if (/^[a-zA-Z]:/.test(normalized)) {
    return normalized;
  }

  // Caso comun en Windows: /C:/ruta/archivo.jpg
  if (/^\/[a-zA-Z]:/.test(normalized)) {
    normalized = normalized.slice(1);
  }

  return normalized;
}

function resolveProductImage(image) {
  const normalized = toFilesystemPath(image);
  if (!normalized) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  return normalized;
}

function listProducts() {
  return db.prepare("SELECT * FROM products ORDER BY id DESC").all();
}

function createProduct(product) {
  const payload = {
    name: product.name ?? "",
    price: Number(product.price ?? 0),
    stock: Number(product.stock ?? 0),
    image: resolveProductImage(product.image),
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
    image: resolveProductImage(product.image),
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
  const numericId = Number(id);
  const product = db.prepare("SELECT image FROM products WHERE id = ?").get(numericId);
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(numericId);

  if (result.changes === 0) {
    return false;
  }

  if (!product || typeof product.image !== "string") {
    return true;
  }

  const imagePath = toFilesystemPath(product.image);
  if (!imagePath) {
    return true;
  }

  const isDefaultImage = path.resolve(imagePath) === path.resolve(DEFAULT_PRODUCT_IMAGE);
  if (isDefaultImage) {
    return true;
  }

  const { total } = db
    .prepare("SELECT COUNT(*) AS total FROM products WHERE image = ?")
    .get(imagePath);

  if (total > 0) {
    return true;
  }

  const candidatePaths = new Set();
  candidatePaths.add(imagePath);

  // Refuerzo: borrar por nombre de archivo dentro de la carpeta administrada del proyecto.
  const imageFileName = path.basename(imagePath);
  if (imageFileName && imageFileName !== "default-product.jpg") {
    candidatePaths.add(path.join(PRODUCT_IMAGES_DIR, imageFileName));
  }

  for (const candidatePath of candidatePaths) {
    const resolvedCandidate = path.resolve(candidatePath);
    if (resolvedCandidate === path.resolve(DEFAULT_PRODUCT_IMAGE)) {
      continue;
    }

    try {
      if (fs.existsSync(resolvedCandidate)) {
        fs.rmSync(resolvedCandidate, { force: true });
      }
    } catch (error) {
      console.error("No se pudo eliminar la imagen del producto:", resolvedCandidate, error);
    }
  }

  return true;
}

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
