import { ipcMain, globalShortcut } from 'electron';
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron';

export const IpcHandle = (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
  ipcMain.handle(propertyKey, (e: IpcMainInvokeEvent, ...args: any[]): any => descriptor.value(...args));
  return descriptor;
}

export const IpcOn = (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
  ipcMain.on(propertyKey, (e: IpcMainEvent, ...args: any[]): void => {
    e.returnValue = descriptor.value(...args);
  });
  return descriptor;
}

export const GlobalShortcut = (accelerator: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
  globalShortcut.register(accelerator, () => descriptor.value(accelerator));
  return descriptor;
}
