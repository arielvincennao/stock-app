//Conexion a SQLite
//Creacion de la tabla products

const Database = require("better-sqlite3");
const path = require("path");
const { sampleProducts } = require("../data/sampleProducts");

const dbPath = path.join(__dirname, "..", "database.db");
const db = new Database(dbPath);
const DEFAULT_PRODUCT_IMAGE = path.join(__dirname, "..", "data", "product-images", "default-product.jpg");

function ensureProductsTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      stock INTEGER,
      image TEXT,
      category TEXT,
      variation TEXT,
      code TEXT
    )
  `).run();
}

function ensureMovementsTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      itemsCount INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      discountPercent REAL NOT NULL,
      discountAmount REAL NOT NULL,
      total REAL NOT NULL
    )
  `).run();
}

function seedProductsIfEmpty() {
  //Si la tabla esta vacia, se insertan los productos de ejemplo
  const { total } = db.prepare("SELECT COUNT(*) AS total FROM products").get();

  if (total > 0) {
    return;
  }

  const insertProduct = db.prepare(
    "INSERT INTO products (name, price, stock, image, category, variation, code) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  const insertMany = db.transaction((products) => {
    products.forEach((product) => {
      const image = typeof product.image === "string" && product.image.trim() ? product.image.trim() : DEFAULT_PRODUCT_IMAGE;
      insertProduct.run(
        product.name,
        product.price,
        product.stock,
        image,
        product.category,
        product.variation,
        product.code
      );
    });
  });

  insertMany(sampleProducts);
}

function normalizeProductImages() {
  db
    .prepare(
      "UPDATE products SET image = ? WHERE image IS NULL OR TRIM(image) = '' OR image LIKE 'http://%' OR image LIKE 'https://%'"
    )
    .run(DEFAULT_PRODUCT_IMAGE);
}

ensureProductsTable();
ensureMovementsTable();
seedProductsIfEmpty();
normalizeProductImages();

module.exports = db;
