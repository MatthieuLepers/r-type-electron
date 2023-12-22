// import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';

import { IpcHandle, IpcOn, GlobalShortcut } from '@/main/decorators';
import { Setting } from '@/main/database/models';
import WindowStore from '@/main/stores/WindowStore';
import WinstonInstance from '@/main/utils/WinstonInstance';
import ElectronWindow from '@/main/classes/ElectronWindow';

class AppModule {
  @IpcHandle
  static async localeChange(iso: string): Promise<void> {
    WindowStore.broadcastData('localeChange', iso);

    const localeSetting = await Setting.findByPk('locale');
    if (localeSetting) {
      await localeSetting.update({ value: iso });
    }
  }

  @IpcHandle
  static async sendDataToWindow(windowName: string, channel: string, ...args: any[]): Promise<void> {
    WindowStore.sendData(windowName, channel, ...args);
  }

  @IpcOn
  static logError(error: string) {
    WinstonInstance.error(error);
  }

  @IpcOn
  static databaseReady() {
    WindowStore.getVisibleWindows().forEach((win) => {
      win.sendData('database-ready');
      win.webContents.addListener('did-finish-load', () => {
        win.sendData('database-ready');
      });
    });
  }

  // @IpcOn
  // static quitAndInstallUpdate() {
  //   autoUpdater.quitAndInstall();
  // }

  @IpcOn
  static readDirSync({ path, onlyFiles, onlyDirectories }) {
    const dirContent = fs.readdirSync(path);
    return dirContent.filter((file) => {
      if (onlyFiles || onlyDirectories) {
        const stats = fs.lstatSync(`${path}/${file}`);
        return (onlyFiles && stats.isFile()) || (onlyDirectories && stats.isDirectory());
      }
      return true;
    });
  }

  @IpcOn
  static openDevTools() {
    if (!WindowStore.has('devTools')) {
      const mainWindow = WindowStore.get('main');

      if (mainWindow) {
        const { x, y, width } = mainWindow.getBounds();

        const devToolsWindow = new ElectronWindow('devTools', {
          width: 300,
          height: 560,
          x: x + width + 8,
          y,
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
        });
        devToolsWindow.setTemplate('devTools');
        devToolsWindow.init();
      }
    }
  }

  @GlobalShortcut('Alt+F4')
  static closeAppNonDarwin() {
    const win = WindowStore.get('main');
    if (win) {
      win.close();
    }
  }

  @GlobalShortcut('Command+Q')
  static closeAppDarwin() {
    const win = WindowStore.get('main');
    if (win) {
      win.close();
    }
  }
}

export default () => AppModule;
