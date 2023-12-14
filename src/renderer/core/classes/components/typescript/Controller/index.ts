import type { Constructor } from '@/renderer/core/@types';
import Component from '@renderer/core/classes/components/Component';
import Control from '@renderer/core/classes/controllers/Control';
import GamepadController from '@renderer/core/classes/controllers/GamepadController';
import KeyboardController from '@renderer/core/classes/controllers/KeyboardController';
import ControlsData from '@renderer/core/datas/Controls';

export default class Controller extends Component {
  public controllerType: KeyboardController | GamepadController | null = null;

  public controls: Record<string, Control> = Object
    .entries(ControlsData)
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key.toUpperCase()]: new Control(key.toUpperCase(), this.inst, value),
    }), {});

  static get TYPE_KEYBOARD(): Constructor<KeyboardController> {
    return KeyboardController;
  }

  static get TYPE_GAMEPAD(): Constructor<GamepadController> {
    return GamepadController;
  }

  setType(type: Constructor<KeyboardController> | Constructor<GamepadController>) {
    this.controllerType = new type(this.controls);
  }

  bindControl(controlName: string, callbacks: Function): Controller {
    Object.assign(this.controls[controlName].options, callbacks);
    return this;
  }

  bindControls(controlsMap: Record<string, Function>) {
    Object
      .entries(controlsMap)
      .forEach(([controlName, callbacks]) => {
        this.bindControl(controlName, callbacks);
      })
    ;
  }

  bind() {
    if (this.controllerType) {
      this.controllerType.bind();
    }
  }

  unbind() {
    if (this.controllerType) {
      this.controllerType.unbind();
    }
  }
}
