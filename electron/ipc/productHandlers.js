//Handlers para los productos

const { ipcMain } = require("electron");
const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../repositories/productRepository");

function registerProductHandlers() {
  ipcMain.handle("get-products", () => listProducts());
  ipcMain.handle("add-product", (event, product) => createProduct(product));
  ipcMain.handle("update-product", (event, id, product) => updateProduct(id, product));
  ipcMain.handle("delete-product", (event, id) => deleteProduct(id));
}

module.exports = {
  registerProductHandlers,
};
