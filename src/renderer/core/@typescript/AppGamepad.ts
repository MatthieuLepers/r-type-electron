import { mix } from '@renderer/core/@types/Mixable';

import Class from '@renderer/core/@typescript/Class';
import EventEmitter from '@renderer/core/@typescript/components/EventEmitter';
import type { IEventEmitter } from '@renderer/core/@typescript/components/EventEmitter/i';
import { EventEmitterMixin } from '@renderer/core/@typescript/components/EventEmitter/mixin';

export default class AppGamepad extends mix(Class).with(EventEmitterMixin) implements IEventEmitter {
  public index: number;

  public oldPressedButtons: Record<string, boolean> = {};

  constructor(gamepadObj: Gamepad) {
    super();
    this.index = gamepadObj.index;

    this.addComponent(EventEmitter, AppGamepad);
  }

  get id(): string {
    return this.gamepad.id ?? '';
  }

  isConnected(): boolean {
    return this.gamepad.connected ?? false;
  }

  get buttons(): readonly GamepadButton[] {
    return this.gamepad.buttons ?? [];
  }

  get axes(): readonly number[] {
    return this.gamepad.axes ?? [];
  }

  get gamepad(): Gamepad {
    return navigator.getGamepads()[this.index];
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
        this.emit('axeInput', { value: axe });
      }
    });
  }
}
