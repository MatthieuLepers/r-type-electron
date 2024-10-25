import type { AnyConstructor } from '@/renderer/core/@types/Mixin';
import ControlsData from '@renderer/core/datas/Controls';

import Component from '@renderer/core/@typescript/components/Component';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import Control from '@renderer/core/@typescript/controllers/Control';
import KeyboardController from '@renderer/core/@typescript/controllers/KeyboardController';
import GamepadController from '@renderer/core/@typescript/controllers/GamepadController';

export default class Controller extends Component<EntityScript> {
  public controllerType: KeyboardController | GamepadController | null = null;

  public controls: Record<string, Control> = Object
    .entries(ControlsData)
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key.toUpperCase()]: new Control(key.toUpperCase(), this.inst, value),
    }), {});

  static get TYPE_KEYBOARD(): AnyConstructor<KeyboardController> {
    return KeyboardController;
  }

  static get TYPE_GAMEPAD(): AnyConstructor<GamepadController> {
    return GamepadController;
  }

  setType(type: AnyConstructor<KeyboardController> | AnyConstructor<GamepadController>) {
    this.controllerType = new type(this.controls);
  }

  bindControl(controlName: string, callbacks: Record<string, Function>): Controller {
    Object.assign(this.controls[controlName].options, callbacks);
    return this;
  }

  bindControls(controlsMap: Record<string, Record<string, Function>>) {
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
