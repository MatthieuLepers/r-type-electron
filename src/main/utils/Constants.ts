import os from 'os';

export const APP_PLATEFORM = os.platform();

export const HOME_DIR = os.homedir();

export const IS_DEV = process.env.NODE_ENV === 'development';

export const APP_DIRECTORY = APP_PLATEFORM === 'win32'
  ? `${os.homedir()}/AppData/Local/PasswordManager`
  : `${os.homedir()}/PasswordManager`
;

export const DATABASE_FILE = !IS_DEV
  ? `${APP_DIRECTORY}/database.sqlite3`
  : './database.sqlite3'
;
