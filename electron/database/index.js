//Conexion a SQLite
//Creacion de la tabla products

const Database = require("better-sqlite3");
const path = require("path");

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

ensureProductsTable();

module.exports = db;
