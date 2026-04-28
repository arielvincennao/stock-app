// Productos de ejemplo para inicializar la base de datos.
const path = require("path");

const DEFAULT_PRODUCT_IMAGE = path.join(__dirname, "product-images", "default-product.jpg");

const sampleProducts = [
  {
    name: "Chocolate Block",
    price: 1600,
    stock: 38,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Golosinas",
    variation: "+1.2%",
    code: "SKU-001",
  },
  {
    name: "Coca Cola 1.25L",
    price: 1200,
    stock: 24,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Bebidas",
    variation: "-0.4%",
    code: "SKU-002",
  },
  {
    name: "Galletas Maria",
    price: 1000,
    stock: 56,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Golosinas",
    variation: "+0.9%",
    code: "SKU-003",
  },
  {
    name: "Leche Descremada 1L",
    price: 1500,
    stock: 18,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Lacteos",
    variation: "+2.1%",
    code: "SKU-004",
  },
  {
    name: "Alfajor Chocolatoso",
    price: 1000,
    stock: 42,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Golosinas",
    variation: "-1.1%",
    code: "SKU-005",
  },
  {
    name: "Papas Fritas Clasicas",
    price: 1350,
    stock: 29,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Snacks",
    variation: "+0.5%",
    code: "SKU-006",
  },
  {
    name: "Yogur Frutilla",
    price: 980,
    stock: 35,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Lacteos",
    variation: "+0.3%",
    code: "SKU-007",
  },
  {
    name: "Cafe Molido 500g",
    price: 3100,
    stock: 14,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Despensa",
    variation: "-0.8%",
    code: "SKU-008",
  },
  {
    name: "Arroz Largo Fino 1kg",
    price: 1420,
    stock: 63,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Despensa",
    variation: "+1.0%",
    code: "SKU-009",
  },
  {
    name: "Jugo Naranja 1L",
    price: 1100,
    stock: 21,
    image: DEFAULT_PRODUCT_IMAGE,
    category: "Bebidas",
    variation: "-0.2%",
    code: "SKU-010",
  },
];

module.exports = {
  sampleProducts,
};
