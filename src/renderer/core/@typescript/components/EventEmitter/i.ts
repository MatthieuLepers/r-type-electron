import type { EventListenerOptions } from '@renderer/core/@typescript/EventListener';

export interface IEventEmitter {
  on(eventName: string, callback: Function, options: EventListenerOptions): void

  off(eventName: string, callback: Function): void;

  offAll(eventName: string): void;

  emit(eventName: string, details?: Record<string, any>): void;
}
