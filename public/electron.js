const { app, BrowserWindow } = require('electron');
const path = require("path");
const { autoUpdater } = require('electron-updater');

const Nucleus = require('nucleus-nodejs');
Nucleus.init('5ec1855e48ae1100ea8d8389');

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

  // Analytics: application has started
  Nucleus.appStarted();

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  // Analytics: application has been closed
  Nucleus.track('APP_CLOSED');
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});