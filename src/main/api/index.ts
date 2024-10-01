import { ipcRenderer, clipboard } from 'electron';

import * as Account from '@/main/api/account';
import * as Setting from '@/main/api/setting';
import * as CipherUtils from '@/main/utils/CipherUtils';
import { APP_PLATEFORM, HOME_DIR, IS_DEV } from '@/main/utils/Constants';

export default {
  async invoke(channel: string, ...args: any[]): Promise<unknown> {
    return ipcRenderer.invoke(channel, ...args);
  },
  send(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args);
  },
  sendSync(channel: string, ...args: any[]): unknown {
    return ipcRenderer.sendSync(channel, ...args);
  },
  on(channel: string, func: Function) {
    ipcRenderer.on(channel, (_e, ...args) => func(...args));
  },
  CipherUtils,
  Setting,
  Account,
  homedir: HOME_DIR,
  plateform: APP_PLATEFORM,
  clipboard,
  isDev: IS_DEV,
};
