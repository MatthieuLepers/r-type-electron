import type Class from '@renderer/core/@typescript/Class';
import type Event from '@renderer/core/@typescript/Event';
import type { IEventEmitter } from '@renderer/core/@typescript/components/EventEmitter/i';

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
    Object.assign(this.options, options);
  }

  invoke(source: Class & IEventEmitter, e: Event) {
    this.callback.call(source, e.eventArgs);
    if (this.options.once) {
      source.off(e.eventName, this.callback);
    }
  }
}
