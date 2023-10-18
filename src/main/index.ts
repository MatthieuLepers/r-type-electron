import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';

import { sequelize } from '@/main/database';
import { Setting } from '@/main/database/models';
import populateDb from '@/main/database/populate';
import ElectronWindow from '@/main/classes/ElectronWindow';
import { APP_PLATEFORM } from '@/main/utils/Constants';

function createWindow() {
  const mainWindow = new ElectronWindow('main', {
    width: 700,
    height: 450,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      allowRunningInsecureContent: false,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      devTools: is.dev,
    },
    icon: join('public/icons/icon16x.png'),
  });
  mainWindow.init();
}

app
  .whenReady()
  .then(async () => {
    electronApp.setAppUserModelId('com.electron');

    const AppModule = await import('@/main/modules/App');
    AppModule.default();

    createWindow();

    await sequelize.sync();
    await Setting.createDefault();
    await populateDb();

    if (is.dev) {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const installExtension = require('electron-devtools-installer');
      await installExtension.default(installExtension.VUEJS_DEVTOOLS, { loadExtensionOptions: { allowFileAccess: true } })
        .then((name: string) => console.log(`Added Extension: ${name}`))
        .catch((err: Error) => console.log('An error occurred: ', err))
      ;
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });
  })
;

app.on('window-all-closed', () => {
  if (APP_PLATEFORM === 'darwin') {
    app.dock.hide();
    app.setActivationPolicy('accessory');
  } else {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (APP_PLATEFORM === 'darwin') {
    app.dock.hide();
    app.setActivationPolicy('accessory');
    app.quit();
  }
});

/*
import { autoUpdater } from 'electron-updater';

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
})

app.on('ready', () => {
  if (!is.dev) autoUpdater.checkForUpdates();
})
*/
