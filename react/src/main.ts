const { app, BrowserWindow, ipcMain, dialog } = require('electron');
import path from 'path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const WIDTH_SIZE = 800;
const HEIGHT_SIZE = 600;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: WIDTH_SIZE,
    height: HEIGHT_SIZE,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.handle('test-first-api', async (_e, _arg) => {
    console.log("#test-first-api");
    console.log("Arguments received:", _arg); // 引数を確認
    return "ret.test-first-api: " + _arg;
  });

  ipcMain.handle('test-second-api', async (_e, a, b) => {
    //console.log("#test-first-api");
    console.log("test-second-api.received:", a); // 引数を確認
    console.log(b);
    const retObj = {
      text: a,
      data: b,
    }
    return retObj;
  });

  ipcMain.handle('get-externel-api', async (_e, path) => {
    //console.log("#test-first-api");
    const retObj = {ret: 500 , data: null};
    console.log("get-externel-api.url=", path); // 引数を確認
    try {
      const url = path;
      const response = await fetch(url); // GETリクエストを送信
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      console.log(text);
      //const data = await response.json(); // レスポンスをJSON形式で取得
      //console.log('Response Data:', data);
      retObj.ret = 200;
      retObj.data = text;
      return retObj;
    } catch (error) {
      console.error(error);
      console.error("エラーが発生しました:", error.message);
      return retObj;
    }
  });

  ipcMain.handle('post-externel-api', async (_e, path, item) => {
    const retObj = {ret: 500, data: null};
    console.log("post-externel-api.url=", path); // 引数を確認
    try {
      const body: any = JSON.stringify(item);		
      const response = await fetch(path, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: body
      });
      const json = await response.json()
      retObj.ret = 200;
      retObj.data = json;
      /*
      const response = await axios.post(path, item, 
        {headers: { 'Content-Type': 'application/json'}
      });
      const data = response.data;
      */
      return retObj;
    } catch (error) {
      console.error(error);
      console.error("エラーが発生しました:", error.message);
      return retObj;
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
