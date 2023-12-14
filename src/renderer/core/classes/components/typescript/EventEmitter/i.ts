import type { EventListenerOptions } from '@renderer/core/classes/EventListener';
import type EventEmitter from '@/renderer/core/classes/components/typescript/EventEmitter';

export interface IEventEmitter {
  components: {
    eventemitter: EventEmitter,
  };

  on(eventName: string, callback: Function, options: EventListenerOptions): void

  off(eventName: string, callback: Function): void;

  offAll(eventName: string): void;

  emit(eventName: string, details?: Record<string, any>): void;
}
