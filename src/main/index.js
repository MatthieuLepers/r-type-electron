import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import fs from 'fs';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      enableRemoteModule: true,
    },
    resizable: false,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('write-file-sync', (e, filePath, data) => {
  e.returnValue = fs.writeFileSync(filePath, data);
});

ipcMain.on('read-file-sync', (e, file) => {
  e.returnValue = `${fs.readFileSync(file)}`;
});

ipcMain.on('read-dir-sync', (e, { path, onlyFiles, onlyDirectories }) => {
  const dirContent = fs.readdirSync(path);
  e.returnValue = dirContent.filter((file) => {
    if (onlyFiles || onlyDirectories) {
      const stats = fs.lstatSync(`${path}/${file}`);
      return (onlyFiles && stats.isFile()) || (onlyDirectories && stats.isDirectory());
    }
    return true;
  });
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
