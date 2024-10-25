import Global from '@renderer/core/stores/AppStore';

import Class from '@renderer/core/@typescript/Class';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import Runnable from '@renderer/core/@typescript/runnable/Runnable';

export interface IControlOptions {
  key?: string;
  button?: unknown;
  axis?: unknown;
  onPress?: () => void;
  onRelease?: () => void;
}

export default class Control extends Class {
  public active: boolean = false;

  public options: IControlOptions = {
    key: null,
    button: null,
    axis: null,
    onPress: null,
    onRelease: null,
  };

  public runnable?: Runnable = null;

  constructor(
    public name: string,
    public inst: EntityScript,
    options: IControlOptions,
  ) {
    super();
    Object.assign(this.options, options);
  }

  get key(): string {
    return this.options.key;
  }

  get button(): unknown {
    return this.options.button;
  }

  get axis(): unknown {
    return this.options.axis;
  }

  start() {
    if (!this.active && typeof this.options.onPress === 'function' && typeof this.options.onRelease === 'function') {
      this.runnable = new Runnable(`${this.name}_${new Date().getTime()}`, this.options.onPress);
      Global.Engine.addRunnable(this.runnable);
      this.active = true;
      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit(`${this.name.toLowerCase()}ControlStart`);
      }
    } else if (typeof this.options.onPress === 'function' && typeof this.options.onRelease !== 'function') {
      this.options.onPress();
      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit(`${this.name.toLowerCase()}ControlStart`);
      }
    }
  }

  stop() {
    if (typeof this.options.onRelease === 'function') {
      window.setTimeout(() => {
        this.options.onRelease();
        Global.Engine.removeRunnable(this.runnable);
        this.active = false;
        if (this.inst.hasComponent('EventEmitter')) {
          this.inst.emit(`${this.name.toLowerCase()}ControlStop`);
        }
      }, 10);
    }
  }
}
