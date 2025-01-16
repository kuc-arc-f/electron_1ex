// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  openDialog: () => ipcRenderer.invoke('open-dialog'),
});

contextBridge.exposeInMainWorld('mytest1api', {
  test1api: (a) => ipcRenderer.invoke('test-first-api', a),
});

contextBridge.exposeInMainWorld('mytestsecondapi', {
  testsecondapi: (a, b) => ipcRenderer.invoke('test-second-api', a, b),
});

contextBridge.exposeInMainWorld('myGetExternelApi', {
  getExternelApi: (a) => ipcRenderer.invoke('get-externel-api', a),
});

contextBridge.exposeInMainWorld('myPostExternelApi', {
  postExternelApi: (a, item) => ipcRenderer.invoke('post-externel-api', a, item),
});


