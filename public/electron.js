const { app, BrowserWindow } = require('electron');
const path = require("path");
const { autoUpdater } = require('electron-updater');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800, 
    height: 600, 
    webPreferences: {
      nodeIntegration: true
    }
 });

  // win.loadFile('index.html');
  //win.loadURL(`file://./build/index.html`);
  win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

  autoUpdater.checkForUpdatesAndNotify();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});