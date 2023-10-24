/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class KeyboardController {
  /**
   * @constructor
   * @param {Control[]} control
   */
  constructor(controls) {
    this.controls = controls;
    this.callbacks = {
      keyDown: this.onKeyDown.bind(this),
      keyUp: this.onKeyUp.bind(this),
    };
  }

  /**
   * @param {Event} e
   */
  onKeyDown(e) {
    Object.values(this.controls).forEach((control) => {
      if ((e.key === control.key || control.active) && typeof control.options.onPress === 'function') {
        control.start();
      }
    });
  }

  /**
   * @param {Event} e
   */
  onKeyUp(e) {
    Object.values(this.controls).forEach((control) => {
      if (e.key === control.key && typeof control.options.onRelease === 'function') {
        control.stop();
      }
    });
  }

  bind() {
    this.unbind();
    window.addEventListener('keydown', this.callbacks.keyDown);
    window.addEventListener('keyup', this.callbacks.keyUp);
  }

  unbind() {
    window.removeEventListener('keydown', this.callbacks.keyDown);
    window.removeEventListener('keyup', this.callbacks.keyUp);
  }
}
