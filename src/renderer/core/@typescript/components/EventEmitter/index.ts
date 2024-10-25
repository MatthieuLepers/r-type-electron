import Component from '@renderer/core/@typescript/components/Component';
import EventListener from '@renderer/core/@typescript/EventListener';

export default class EventEmitter<T> extends Component<T> {
  public listeners: Map<string, Map<Function, EventListener>> = new Map<string, Map<Function, EventListener>>();

  toDebugObject() {
    return {
      listeners: this.listeners.keys(),
    };
  }
}
