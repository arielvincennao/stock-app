//Handlers para los productos

const { ipcMain } = require("electron");
const {
  listProducts,
  createProduct,
} = require("../repositories/productRepository");

function registerProductHandlers() {
  ipcMain.handle("get-products", () => listProducts());
  ipcMain.handle("add-product", (event, product) => createProduct(product));
}

module.exports = {
  registerProductHandlers,
};
