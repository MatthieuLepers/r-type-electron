import type Class from '@renderer/core/@typescript/Class';
import type { IEventEmitter } from '@renderer/core/@typescript/components/EventEmitter/i';

export interface IEvent {
  source: Class & IEventEmitter;
  details: Record<string, any>;
}

export default class Event {
  constructor(
    public eventName: string,
    public eventArgs: IEvent,
  ) {}

  dispatchEvent() {
    if (this.eventArgs.source.components.eventemitter && this.eventArgs.source.components.eventemitter.listeners.has(this.eventName)) {
      this.eventArgs.source.components.eventemitter.listeners.get(this.eventName).forEach((eventListener) => {
        eventListener.invoke(this.eventArgs.source, this);
      });
    }
  }
}
