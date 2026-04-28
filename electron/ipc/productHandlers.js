//Handlers para los productos

const { ipcMain } = require("electron");
const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../repositories/productRepository");
const { pickAndStoreProductImage } = require("../services/imageStorage");

function registerProductHandlers() {
  ipcMain.handle("get-products", () => listProducts());
  ipcMain.handle("add-product", (event, product) => createProduct(product));
  ipcMain.handle("update-product", (event, id, product) => updateProduct(id, product));
  ipcMain.handle("delete-product", (event, id) => deleteProduct(id));
  ipcMain.handle("pick-and-store-image", () => pickAndStoreProductImage());
}

module.exports = {
  registerProductHandlers,
};
