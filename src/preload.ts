import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("devosDesktop", {
  getRuntimeStatus: () => ipcRenderer.invoke("runtime:status"),
});
