import Class from '@renderer/core/classes/Class';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class AppGamepad extends Class {
  /**
   * @constructor
   * @param {Gamepad} gamepadObj
   */
  constructor(gamepadObj) {
    super();
    this.index = gamepadObj.index;
    this.oldPressedButtons = {};

    this.addComponent(EventEmitter, AppGamepad);
  }

  /**
   * @return {String}
   */
  get id() {
    return this.gamepad.id ?? '';
  }

  /**
   * @return {Boolean}
   */
  isConnected() {
    return this.gamepad.connected ?? false;
  }

  /**
   * @return {GamepadButton[]}
   */
  get buttons() {
    return this.gamepad.buttons ?? [];
  }

  /**
   * @return {Object[]}
   */
  get axes() {
    return this.gamepad.axes ?? [];
  }

  /**
   * @return {Gamepad|Object}
   */
  get gamepad() {
    return navigator.getGamepads()[this.index] ?? {};
  }

  update() {
    Object.entries(this.buttons).forEach((entry) => {
      const [index, btn] = entry;
      if (!this.oldPressedButtons[index] && btn.pressed) {
        this.oldPressedButtons[index] = true;
        this.emit('buttonPressed', { button: parseInt(index, 10) });
      } else if (this.oldPressedButtons[index] && !btn.pressed) {
        this.oldPressedButtons[index] = false;
        this.emit('buttonReleased', { button: parseInt(index, 10) });
      }
    });
    Object.values(this.axes).forEach((axe) => {
      if (Math.abs(axe) >= 0.3) {
        this.emit('axeInput', { value: parseFloat(axe).toFixed(2) });
      }
    });
  }
}
