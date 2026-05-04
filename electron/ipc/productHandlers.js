//Handlers para los productos

const { ipcMain } = require("electron");
const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../repositories/productRepository");
const { listMovements, getMovementDetail, createMovement, deleteMovement } = require("../repositories/movementRepository");
const { pickAndStoreProductImage } = require("../services/imageStorage");

function registerProductHandlers() {
  ipcMain.handle("get-products", () => listProducts());
  ipcMain.handle("add-product", (event, product) => createProduct(product));
  ipcMain.handle("update-product", (event, id, product) => updateProduct(id, product));
  ipcMain.handle("delete-product", (event, id) => deleteProduct(id));
  ipcMain.handle("get-movements", () => listMovements());
  ipcMain.handle("get-movement-detail", (event, id) => getMovementDetail(id));
  ipcMain.handle("add-movement", (event, movement) => createMovement(movement));
  ipcMain.handle("delete-movement", (event, id) => deleteMovement(id));
  ipcMain.handle("pick-and-store-image", () => pickAndStoreProductImage());
}

module.exports = {
  registerProductHandlers,
};
