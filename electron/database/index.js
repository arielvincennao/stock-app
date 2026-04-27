//Conexion a SQLite
//Creacion de la tabla products

const Database = require("better-sqlite3");
const path = require("path");
const { sampleProducts } = require("../data/sampleProducts");

const dbPath = path.join(__dirname, "..", "database.db");
const db = new Database(dbPath);

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
      insertProduct.run(
        product.name,
        product.price,
        product.stock,
        product.image,
        product.category,
        product.variation,
        product.code
      );
    });
  });

  insertMany(sampleProducts);
}

ensureProductsTable();
seedProductsIfEmpty();

module.exports = db;
