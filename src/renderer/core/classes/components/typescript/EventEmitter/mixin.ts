import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type { EventListenerOptions } from '@renderer/core/classes/EventListener';
import type EventEmitter from '@/renderer/core/classes/components/typescript/EventEmitter';
import type { IEventEmitter } from '@/renderer/core/classes/components/typescript/EventEmitter/i';
import EventListener from '@renderer/core/classes/EventListener';
import Event from '@renderer/core/classes/Event';

export const EventEmitterMixin = (superclass: Constructor<Class>) => class extends superclass implements IEventEmitter {
  declare components: {
    eventemitter: EventEmitter,
  };

  on(eventName: string, callback: Function, options: EventListenerOptions) {
    if (!this.components.eventemitter.listeners.has(eventName)) {
      this.components.eventemitter.listeners.set(eventName, new Map());
    }
    this.components.eventemitter.listeners.get(eventName)!.set(callback, new EventListener(callback, options));
  }

  off(eventName: string, callback: Function) {
    if (this.components.eventemitter.listeners.has(eventName)) {
      this.components.eventemitter.listeners.get(eventName)!.delete(callback);

      if (!this.components.eventemitter.listeners.get(eventName)!.size) {
        this.components.eventemitter.listeners.delete(eventName);
      }
    }
  }

  offAll(eventName: string) {
    this.components.eventemitter.listeners.delete(eventName);
  }

  emit(eventName: string, details?: Record<string, any>) {
    const ev = new Event(eventName, { source: this, details: details ?? {} });
    ev.dispatchEvent();
  }
};
