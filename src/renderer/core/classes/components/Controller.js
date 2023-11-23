import Component from '@renderer/core/classes/components/Component';
import Control from '@renderer/core/classes/controllers/Control';
import GamepadController from '@renderer/core/classes/controllers/GamepadController';
import KeyboardController from '@renderer/core/classes/controllers/KeyboardController';
import ControlsData from '@renderer/core/datas/Controls';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Controller extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.controllerType = null;
    this.controls = {};

    Object.entries(ControlsData).forEach(([key, value]) => {
      this.controls[key.toUpperCase()] = new Control(key.toUpperCase(), this.inst, value);
    });
  }

  /**
   * @return {Constructor}
   */
  static get TYPE_KEYBOARD() {
    return KeyboardController;
  }

  /**
   * @return {Constructor}
   */
  static get TYPE_GAMEPAD() {
    return GamepadController;
  }

  /**
   * @param {Controller} type
   * @return {this}
   */
  setType(type) {
    this.controllerType = new type(this.controls);
    return this;
  }

  /**
   * @param {String} controlName
   * @param {Function} callbacks
   * @return {this}
   */
  bindControl(controlName, callbacks) {
    Object.assign(this.controls[controlName].options, callbacks);
    return this;
  }

  bindControls(controlsMap = {}) {
    Object.entries(controlsMap).forEach(([controlName, callbacks]) => {
      this.bindControl(controlName, callbacks);
    });
  }

  /**
   * @return {this}
   */
  bind() {
    this.controllerType.bind();
    return this;
  }

  /**
   * @return {this}
   */
  unbind() {
    this.controllerType.unbind();
    return this;
  }
}
