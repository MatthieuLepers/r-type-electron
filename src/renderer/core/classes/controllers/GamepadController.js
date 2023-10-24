import Global from '@renderer/core/stores/AppStore';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class GamepadController {
  /**
   * @constructor
   * @param {Control[]} controls
   * @param {Number} gamepadIndex
   */
  constructor(controls, gamepadIndex = 0) {
    this.controls = controls;
    this.gamepad = Global.Gamepads.get(gamepadIndex);

    this.callbacks = {
      onButtonPressed: this.onButtonPressed.bind(this),
      onButtonReleased: this.onButtonReleased.bind(this),
    };
  }

  /**
   * @param {Event} e
   */
  onButtonPressed(e) {
    Object.values(this.controls).forEach((control) => {
      if ((e.details.button === control.button || control.active) && typeof control.options.onPress === 'function') {
        control.start();
      }
    });
  }

  /**
   * @param {Event} e
   */
  onButtonReleased(e) {
    Object.values(this.controls).forEach((control) => {
      if (e.details.button === control.button && typeof control.options.onRelease === 'function') {
        control.stop();
      }
    });
  }

  bind() {
    this.unbind();
    this.gamepad.on('buttonPressed', this.callbacks.onButtonPressed);
    this.gamepad.on('buttonReleased', this.callbacks.onButtonReleased);
  }

  unbind() {
    this.gamepad.off('buttonPressed', this.callbacks.onButtonPressed);
    this.gamepad.off('buttonReleased', this.callbacks.onButtonReleased);
  }
}
