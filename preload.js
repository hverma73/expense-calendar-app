// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js is running');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, data) => {
      console.log(`Invoking IPC channel: ${channel}`, data);
      return ipcRenderer.invoke(channel, data);
    }
  }
});
