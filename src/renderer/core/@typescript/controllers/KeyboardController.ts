import type Control from '@renderer/core/@typescript/controllers/Control';

export interface IKeyboardControllerCallbacks {
  keyDown: () => void;
  keyUp: () => void;
}

export default class KeyboardController {
  #callbacks: IKeyboardControllerCallbacks = {
    keyDown: this.onKeyDown.bind(this),
    keyUp: this.onKeyUp.bind(this),
  };

  constructor(public controls: Array<Control>) {
  }

  onKeyDown(e: KeyboardEvent) {
    Object.values(this.controls).forEach((control) => {
      if ((e.key === control.key || control.active) && typeof control.options.onPress === 'function') {
        control.start();
      }
    });
  }

  onKeyUp(e: KeyboardEvent) {
    Object.values(this.controls).forEach((control) => {
      if (e.key === control.key && typeof control.options.onRelease === 'function') {
        control.stop();
      }
    });
  }

  bind() {
    this.unbind();
    window.addEventListener('keydown', this.#callbacks.keyDown);
    window.addEventListener('keyup', this.#callbacks.keyUp);
  }

  unbind() {
    window.removeEventListener('keydown', this.#callbacks.keyDown);
    window.removeEventListener('keyup', this.#callbacks.keyUp);
  }
}
