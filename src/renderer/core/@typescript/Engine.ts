import { mix } from '@renderer/core/@types/Mixable';

import Class from '@renderer/core/@typescript/Class';
import EventEmitter from '@renderer/core/@typescript/components/EventEmitter';
import type { IEventEmitter } from '@renderer/core/@typescript/components/EventEmitter/i';
import { EventEmitterMixin } from '@renderer/core/@typescript/components/EventEmitter/mixin';
import type Runnable from '@renderer/core/@typescript/runnable/Runnable';
import type PhysicRunnable from '@renderer/core/@typescript/runnable/PhysicRunnable';

export default class Engine extends mix(Class).with(EventEmitterMixin) implements IEventEmitter {
  public runnableList: Record<string, Runnable> = {};

  public physicRunnable: PhysicRunnable = null;

  public $running: boolean = false;

  public paused: boolean = false;

  public fps: number = 60;

  public debug: boolean = false;

  public $frame: number = 0;

  public $fpsInterval: number = 1000 / this.fps;

  public $then: number = Date.now();

  public $startTime: number = this.$then;

  public $frameCount: number = 0;

  public $currentFps: number = this.fps;

  constructor() {
    super();
    window.setInterval(() => {
      this.$currentFps = this.$frameCount;
      this.$frameCount = 0;
    }, 1000);

    this.addComponent(EventEmitter, Engine);

    document.addEventListener('visibilitychange', () => this.togglePause());
  }

  get FRAME(): number {
    return this.$frame;
  }

  get FPS(): number {
    return this.$currentFps;
  }

  get FPS_COLOR(): string {
    if (this.FPS >= this.fps * (5 / 6)) {
      return '#0f0';
    }
    if (this.FPS < this.fps / 2) {
      return '#f00';
    }
    return '#ff7c00';
  }

  get elapsedTime(): string {
    const seconds = Math.floor(this.$frameCount / 60);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const padHours = String(hours).padStart(2, '0');
    const padMinutes = String(minutes - (hours * 60)).padStart(2, '0');
    const padSeconds = String(seconds - (minutes * 60)).padStart(2, '0');
    return `${padHours}:${padMinutes}:${padSeconds}`;
  }

  addRunnable(runnable: Runnable): Runnable {
    this.runnableList[runnable.name] = runnable;
    return runnable;
  }

  removeRunnable(runnable: Runnable): this {
    if (runnable && this.runnableList[runnable.name]) {
      delete this.runnableList[runnable.name];
    }
    return this;
  }

  removeRunnableByName(name: string): this {
    return this.removeRunnable({ name } as Runnable);
  }

  task() {
    this.$frame = window.requestAnimationFrame(this.task.bind(this));

    const now = Date.now();
    const elapsed = now - this.$then;

    if (!this.paused && elapsed > this.$fpsInterval) {
      this.$then = now - (elapsed % this.$fpsInterval);
      this.$frameCount += 1;
      this.step();
    }
  }

  step() {
    Object
      .values(this.runnableList)
      .filter((runnable) => !this.debug || (this.debug && runnable.canRunInDebugMode))
      .forEach((runnable) => { runnable.step(this.$frame); })
    ;
    if (this.physicRunnable) {
      this.physicRunnable.step();
    }
    return this;
  }

  start(): this {
    if (!this.$running) {
      this.$fpsInterval = 1000 / this.fps;
      this.$then = Date.now();
      this.$startTime = this.$then;
      this.$running = true;
      this.task();
    }
    return this;
  }

  pause(): this {
    this.paused = true;
    this.emit('paused');
    return this;
  }

  resume(): this {
    this.paused = false;
    this.emit('resumed');
    return this;
  }

  togglePause(): this {
    return (this.paused ? this.resume() : this.pause());
  }

  stop() {
    window.cancelAnimationFrame(this.$frame);
    this.$running = false;
    this.paused = false;
    this.$frame = null;
    this.fps = 0;
  }
}
