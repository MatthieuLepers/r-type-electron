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
   * @param {Boolean} canRunInDebugMode
   */
  constructor(name, callback = null, canRunInDebugMode = false) {
    super();
    this.name = name;
    this.callback = callback;
    this.canRunInDebugMode = canRunInDebugMode;
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
