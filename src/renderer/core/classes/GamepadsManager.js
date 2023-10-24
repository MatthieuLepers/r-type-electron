import Global from '@renderer/core/stores/AppStore';
import Class from '@renderer/core/classes/Class';
import AppGamepad from '@renderer/core/classes/AppGamepad';
import Runnable from '@renderer/core/classes/runnable/Runnable';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class GamepadManager extends Class {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.gamepads = {};

    this.init();
  }

  /**
   * @param {Number} index
   */
  get(index) {
    return this.gamepads[index] ?? null;
  }

  init() {
    window.addEventListener('gamepadconnected', this.onConnect.bind(this));
    window.addEventListener('gamepaddisconnected', this.onDisconnect.bind(this));

    Global.Engine.addRunnable(new Runnable('gamepadapi', () => {
      Object.values(this.gamepads).forEach((gamepad) => { gamepad.update(); });
    }));
  }

  update() {
    this.gamepads = {};
    Object.values(navigator.getGamepads()).forEach((gamepad) => {
      if (gamepad) {
        this.gamepads[gamepad.index] = new AppGamepad(gamepad);
      }
    });
  }

  /**
   * @param {GamepadEvent} e
   */
  onConnect(e) {
    console.log('[GamepadManager] Gamepad connected.', e);
    this.update();
  }

  /**
   * @param {GamepadEvent} e
   */
  onDisconnect(e) {
    console.log('[GamepadManager] Gamepad disconnected.', e);
    this.update();
  }
}
