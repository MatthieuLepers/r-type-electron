import type Event from '@renderer/core/classes/Event';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type { IEventEmitter } from '@/renderer/core/classes/components/typescript/EventEmitter/mixin';

export interface EventListenerOptions {
  once: boolean;
}

export default class EventListener {
  public options: EventListenerOptions = {
    once: false,
  };

  constructor(
    public callback: Function,
    options: EventListenerOptions,
  ) {
    this.callback = callback;
    Object.assign(this.options, options);
  }

  invoke(source: EntityScript & IEventEmitter, e: Event) {
    this.callback.call(source, e.eventArgs);
    if (this.options.once) {
      source.off(e.eventName, this.callback);
    }
  }
}
