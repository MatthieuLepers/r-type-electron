import Class from '@renderer/core/classes/Class';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Runnable extends Class {
  /**
   * @constructor
   * @param {String} name
   * @param {Function} callback
   */
  constructor(name, callback = null) {
    super();
    this.name = name;
    this.callback = callback;
  }

  /**
   * @param {Number} frame
   */
  step(frame) {
    if (this.callback) {
      this.callback.call(this, frame);
    }
  }
}
