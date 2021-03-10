/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class EventListener {
  /**
   * @constructor
   * @param {Function} callback
   * @param {Object} options
   */
  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = {
      once: false,
    };

    Object.assign(this.options, options);
  }

  /**
   * @param {Object} source
   * @param {Event} e
   */
  invoke(source, e) {
    this.callback.call(source, e.eventArgs);
    if (this.options.once) {
      source.off(e.eventName, this.callback);
    }
  }
}
