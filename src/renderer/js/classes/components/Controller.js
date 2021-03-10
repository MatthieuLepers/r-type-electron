import Component from './Component';
import Control from '../controllers/Control';
import GamepadController from '../controllers/GamepadController';
import KeyboardController from '../controllers/KeyboardController';
import ControlsData from '../../datas/Controls';

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

    this.init();
  }

  init() {
    Object.entries(ControlsData).forEach((entry) => {
      const [key, value] = entry;
      this.controls[key.toUpperCase()] = new Control(key.toUpperCase(), this.inst, {
        key: value.key,
        button: value.button,
        axis: value.axis || null,
      });
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
