import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import Event from '@renderer/core/@typescript/Event';
import EventEmitter from '@renderer/core/@typescript/components/EventEmitter';
import type { IEventEmitter } from '@renderer/core/@typescript/components/EventEmitter/i';
import EventListener, { type EventListenerOptions } from '@renderer/core/@typescript/EventListener';

export const EventEmitterMixin = <T extends AnyConstructor<Class>>(base : T) => class MyEventEmitterMixin extends base implements IEventEmitter {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(EventEmitter<T>, MyEventEmitterMixin);
  }

  on(eventName: string, callback: Function, options?: EventListenerOptions) {
    if (!this.components.eventemitter.listeners.has(eventName)) {
      this.components.eventemitter.listeners.set(eventName, new Map());
    }
    this.components.eventemitter.listeners.get(eventName).set(callback, new EventListener(callback, options));
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
    const ev = new Event(eventName, { source: this, details });
    ev.dispatchEvent();
  }
};
