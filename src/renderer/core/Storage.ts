import { name } from '../../../package.json';

interface IStorage {
  settings: Record<string, string>;
}

const DEFAULT_STORAGE: IStorage = {
  settings: {},
};

export function getLocalStorage(): IStorage {
  try {
    return JSON.parse(localStorage.getItem(name) ?? JSON.stringify(DEFAULT_STORAGE));
  } catch {
    return DEFAULT_STORAGE;
  }
}

export function setLocalStorage(storage: IStorage) {
  localStorage.setItem(name, JSON.stringify(storage));
}
