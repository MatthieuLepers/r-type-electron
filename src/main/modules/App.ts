// import { autoUpdater } from 'electron-updater';

import { IpcHandle, IpcOn, GlobalShortcut } from '@/main/decorators';
import { Setting } from '@/main/database/models';
import WindowStore from '@/main/stores/WindowStore';
import { getFaviconBase64 } from '@/main/utils/AppUtils';
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
  static async getFavicon(domain: string): Promise<string> {
    return getFaviconBase64(domain);
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
