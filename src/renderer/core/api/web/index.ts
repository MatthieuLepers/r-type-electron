import * as Account from '@renderer/core/api/web/Account';
import * as Setting from '@renderer/core/api/web/Setting';

function send(channel: string, ...args: any[]) {
  const event = new CustomEvent(channel, { detail: { ...args } });
  document.body.dispatchEvent(event);
}

const API_FALLBACKS: Record<string, Function> = {
  async localeChange(iso: string) {
    send('localeChange', iso);
    await Setting.updateOrCreate(`{"key": "locale", "value": "${iso}"}`);
  },
};

export const api = {
  async invoke(channel: string, ...args: any[]) {
    return API_FALLBACKS[channel](...args);
  },
  send,
  sendSync(channel: string, ...args: any[]) {
    return API_FALLBACKS[channel](...args);
  },
  on(channel: string, func: Function) {
    document.body.addEventListener(channel, (e) => func(...Object.values((e as CustomEvent).detail)));
  },
  Account,
  Setting,
  CipherUtils: {
    cipher(_options: Object, str: string): string {
      return btoa(str);
    },
    decipher(_options: Object, str: string): string {
      return atob(str);
    },
  },
  homedir: '/',
  plateform: navigator.userAgent,
  clipboard: navigator.clipboard,
  isDev: process.env.NODE_ENV !== 'production',
  isWeb: true,
};
