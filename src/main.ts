import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webUrl = process.env.DEVOS_WEB_URL ?? "http://localhost:3000";
const runtimeUrl = process.env.DEVOS_RUNTIME_URL ?? "http://127.0.0.1:3180";
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

async function getRuntimeStatus() {
  try {
    const response = await fetch(`${runtimeUrl}/health`, {
      signal: AbortSignal.timeout(2_000),
    });
    const payload = response.ok
      ? ((await response.json()) as { status?: string })
      : undefined;
    return { available: payload?.status === "ok", runtimeUrl };
  } catch {
    return { available: false, runtimeUrl };
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#090909",
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(currentDirectory, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });
  void window.loadURL(webUrl);
}

app.whenReady().then(() => {
  ipcMain.handle("runtime:status", getRuntimeStatus);
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
