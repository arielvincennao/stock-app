//Preload para la aplicacion

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getProducts: () => ipcRenderer.invoke("get-products"),
  addProduct: (product) =>
    ipcRenderer.invoke("add-product", product),
  updateProduct: (id, product) =>
    ipcRenderer.invoke("update-product", id, product),
  deleteProduct: (id) =>
    ipcRenderer.invoke("delete-product", id),
  getMovements: () =>
    ipcRenderer.invoke("get-movements"),
  getMovementDetail: (id) =>
    ipcRenderer.invoke("get-movement-detail", id),
  addMovement: (movement) =>
    ipcRenderer.invoke("add-movement", movement),
  deleteMovement: (id) =>
    ipcRenderer.invoke("delete-movement", id),
  pickAndStoreImage: () =>
    ipcRenderer.invoke("pick-and-store-image"),
});