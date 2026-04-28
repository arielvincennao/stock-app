const { app, dialog, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"]);

function ensureImagesDirectory() {
  // Carpeta central de imagenes dentro del proyecto.
  const imagesDir = path.join(app.getAppPath(), "electron", "data", "product-images");
  fs.mkdirSync(imagesDir, { recursive: true });
  return imagesDir;
}

function buildStoredImagePath(sourcePath) {
  const ext = path.extname(sourcePath).toLowerCase();
  const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : ".img";
  const fileName = `product-${Date.now()}-${Math.floor(Math.random() * 100000)}${safeExt}`;
  return path.join(ensureImagesDirectory(), fileName);
}

async function pickAndStoreProductImage() {
  const focusedWindow = BrowserWindow.getFocusedWindow() || null;
  const imagesDir = ensureImagesDirectory();
  const result = await dialog.showOpenDialog(focusedWindow, {
    title: "Seleccionar imagen del producto",
    defaultPath: imagesDir,
    properties: ["openFile"],
    filters: [
      { name: "Imagenes", extensions: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const sourcePath = result.filePaths[0];
  const destinationPath = buildStoredImagePath(sourcePath);
  fs.copyFileSync(sourcePath, destinationPath);

  return destinationPath;
}

module.exports = {
  pickAndStoreProductImage,
};
