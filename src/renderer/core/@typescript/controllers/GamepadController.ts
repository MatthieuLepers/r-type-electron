import Global from '@renderer/core/stores/AppStore';

import type Control from '@renderer/core/@typescript/controllers/Control';
import type { IEvent } from '@renderer/core/@typescript/Event';
import type AppGamepad from '@renderer/core/@typescript/AppGamepad';

export interface IGamepadControllerCallbacks {
  onButtonPressed: () => void;
  onButtonReleased: () => void;
}

export default class GamepadController {
  public gamepad: AppGamepad;

  #callbacks: IGamepadControllerCallbacks = {
    onButtonPressed: this.onButtonPressed.bind(this),
    onButtonReleased: this.onButtonReleased.bind(this),
  };

  constructor(
    public controls: Array<Control>,
    public gamepadIndex: number = 0,
  ) {
    this.gamepad = Global.Gamepads.get(gamepadIndex);
  }

  onButtonPressed(e: IEvent) {
    Object.values(this.controls).forEach((control) => {
      if ((e.details.button === control.button || control.active) && typeof control.options.onPress === 'function') {
        control.start();
      }
    });
  }

  onButtonReleased(e: IEvent) {
    Object.values(this.controls).forEach((control) => {
      if (e.details.button === control.button && typeof control.options.onRelease === 'function') {
        control.stop();
      }
    });
  }

  bind() {
    this.unbind();
    this.gamepad.on('buttonPressed', this.#callbacks.onButtonPressed);
    this.gamepad.on('buttonReleased', this.#callbacks.onButtonReleased);
  }

  unbind() {
    this.gamepad.off('buttonPressed', this.#callbacks.onButtonPressed);
    this.gamepad.off('buttonReleased', this.#callbacks.onButtonReleased);
  }
}
