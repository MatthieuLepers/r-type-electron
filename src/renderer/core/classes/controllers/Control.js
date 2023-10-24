import Global from '@renderer/core/stores/AppStore';
import Class from '@renderer/core/classes/Class';
import Runnable from '@renderer/core/classes/runnable/Runnable';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Control extends Class {
  /**
   * @constructor
   * @param {String} name
   * @param {EntityScript} inst
   * @param {Object} options
   */
  constructor(name, inst, options) {
    super();
    this.name = name;
    this.inst = inst;
    this.active = false;
    this.options = {
      key: null,
      button: null,
      axis: null,
      onPress: null,
      onRelease: null,
    };
    this.runnable = null;

    Object.assign(this.options, options);
  }

  /**
   * @return {String}
   */
  get key() {
    return this.options.key;
  }

  /**
   * @return {?}
   */
  get button() {
    return this.options.button;
  }

  /**
   * @return {?}
   */
  get axe() {
    return this.options.axe;
  }

  start() {
    if (!this.active && typeof this.options.onPress === 'function' && typeof this.options.onRelease === 'function') {
      this.runnable = new Runnable(`${this.name}_${new Date().getTime()}`, this.options.onPress);
      Global.Engine.addRunnable(this.runnable);
      this.active = true;
      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit(`${this.name.toLowerCase()}ControlStart`);
      }
    } else if (typeof this.options.onPress === 'function' && typeof this.options.onRelease !== 'function') {
      this.options.onPress();
      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit(`${this.name.toLowerCase()}ControlStart`);
      }
    }
  }

  stop() {
    if (typeof this.options.onRelease === 'function') {
      window.setTimeout(() => {
        this.options.onRelease();
        Global.Engine.removeRunnable(this.runnable);
        this.active = false;
        if (this.inst.hasComponent('EventEmitter')) {
          this.inst.emit(`${this.name.toLowerCase()}ControlStop`);
        }
      }, 10);
    }
  }
}
