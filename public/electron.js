const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

const Nucleus = require('nucleus-nodejs');
Nucleus.init('5ec1855e48ae1100ea8d8389');

let win;
let tray;

function createTray() {
  const iconPath = path.join(__dirname, "logo16.png");
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      type: 'normal',
      click() {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Yet Another React Electron Boilerplate');
  tray.setContextMenu(contextMenu);
}

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

app.on('ready', () => {
  createTray();
  createWindow();
});

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