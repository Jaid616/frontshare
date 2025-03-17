// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs for IndexedDB operations
contextBridge.exposeInMainWorld('electronIndexedDB', {
  checkAvailability: () => true,
  // You can add more specialized functions if needed
});