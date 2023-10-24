// import { autoUpdater } from 'electron-updater';
import fs from 'fs';

import { IpcHandle, IpcOn, GlobalShortcut } from '@/main/decorators';
import { Setting } from '@/main/database/models';
import WindowStore from '@/main/stores/WindowStore';
import WinstonInstance from '@/main/utils/WinstonInstance';

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
