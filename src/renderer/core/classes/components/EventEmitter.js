import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';
import EventListener from '@renderer/core/classes/EventListener';
import Event from '@renderer/core/classes/Event';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class EventEmitter extends Component {
  /**
   * @inheritDoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.listeners = new Map();

    /**
     * @param {String} eventName
     * @param {Function} invokeFun
     * @param {Object} options
     */
    AddClassMethod(this.clazz, 'on', function (eventName, callback, options = {}) {
      if (!this.components.eventemitter.listeners.has(eventName)) {
        this.components.eventemitter.listeners.set(eventName, new Map());
      }
      this.components.eventemitter.listeners.get(eventName).set(callback, new EventListener(callback, options));
    });

    /**
     * @param {String} eventName
     * @param {Function} invokeFun
     */
    AddClassMethod(this.clazz, 'off', function (eventName, callback) {
      if (this.components.eventemitter.listeners.has(eventName)) {
        this.components.eventemitter.listeners.get(eventName).delete(callback);

        if (!this.components.eventemitter.listeners.get(eventName).size) {
          this.components.eventemitter.listeners.delete(eventName);
        }
      }
    });

    /**
     * @param {String} eventName
     */
    AddClassMethod(this.clazz, 'offAll', function (eventName) {
      this.components.eventemitter.listeners.delete(eventName);
    });

    /**
     * @param {String} eventName
     * @param {Object} details
     */
    AddClassMethod(this.clazz, 'emit', function (eventName, details = {}) {
      const ev = new Event(eventName, { source: this, details });
      ev.dispatchEvent();
    });
  }
}
