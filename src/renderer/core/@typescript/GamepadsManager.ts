import Global from '@renderer/core/stores/AppStore';
import AppGamepad from '@renderer/core/@typescript/AppGamepad';
import Runnable from '@renderer/core/@typescript/runnable/Runnable';

export default class GamepadManager {
  public gamepads: Record<number, AppGamepad> = {};

  constructor() {
    window.addEventListener('gamepadconnected', this.onConnect.bind(this));
    window.addEventListener('gamepaddisconnected', this.onDisconnect.bind(this));

    Global.Engine.addRunnable(new Runnable('gamepadapi', () => {
      Object.values(this.gamepads).forEach((gamepad) => { gamepad.update(); });
    }));
  }

  get(index: number): AppGamepad | null {
    return this.gamepads[index] ?? null;
  }

  update() {
    this.gamepads = {};
    Object.values(navigator.getGamepads()).forEach((gamepad) => {
      if (gamepad) {
        this.gamepads[gamepad.index] = new AppGamepad(gamepad);
      }
    });
  }

  onConnect(e: GamepadEvent) {
    console.log('[GamepadManager] Gamepad connected.', e);
    this.update();
  }

  onDisconnect(e: GamepadEvent) {
    console.log('[GamepadManager] Gamepad disconnected.', e);
    this.update();
  }
}
