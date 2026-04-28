//Main para la aplicacion

const { app, BrowserWindow } = require("electron");
const path = require("path");
const { registerProductHandlers } = require("./ipc/productHandlers");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // Permite mostrar imagenes file:// desde el renderer (http://localhost:5173).
      webSecurity: false,
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);
registerProductHandlers();