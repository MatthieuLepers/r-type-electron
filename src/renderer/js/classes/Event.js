/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Event {
  /**
   * @constructor
   * @param {String} eventName
   * @param {Object} eventArgs
   */
  constructor(eventName, eventArgs) {
    this.eventName = eventName;
    this.eventArgs = eventArgs;
  }

  dispatchEvent() {
    if (this.eventArgs.source.components.eventemitter && this.eventArgs.source.components.eventemitter.listeners.has(this.eventName)) {
      this.eventArgs.source.components.eventemitter.listeners.get(this.eventName).forEach((eventListener) => {
        eventListener.invoke(this.eventArgs.source, this);
      });
    }
  }
}
