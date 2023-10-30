import Class from '@renderer/core/classes/Class';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Engine extends Class {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.runnableList = {};
    this.physicRunnable = null;
    this.$running = false;
    this.paused = false;
    this.fps = 60;
    this.debug = false;

    this.$frame = null;
    this.$fpsInterval = 1000 / this.fps;
    this.$then = Date.now();
    this.$startTime = this.$then;
    this.$frameCount = 0;
    this.$currentFps = this.fps;

    window.setInterval(() => {
      this.$currentFps = this.$frameCount;
      this.$frameCount = 0;
    }, 1000);

    this.addComponent(EventEmitter, Engine);

    document.addEventListener('visibilitychange', () => this.togglePause());
  }

  /**
   * @return {Number}
   */
  get FRAME() {
    return this.$frame;
  }

  /**
   * @return {Number}
   */
  get FPS() {
    return this.$currentFps;
  }

  /**
   * @return {String}
   */
  get FPS_COLOR() {
    if (this.FPS >= this.fps * (5 / 6)) {
      return '#0f0';
    }
    if (this.FPS < this.fps / 2) {
      return '#f00';
    }
    return '#ff7c00';
  }

  /**
   * @return {String}
   */
  get elapsedTime() {
    const seconds = Math.floor(this.$frameCount / 60);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const padHours = String(hours).padStart(2, '0');
    const padMinutes = String(minutes - (hours * 60)).padStart(2, '0');
    const padSeconds = String(seconds - (minutes * 60)).padStart(2, '0');
    return `${padHours}:${padMinutes}:${padSeconds}`;
  }

  /**
   * @param {Runnable} runnable
   * @return {Runnable}
   */
  addRunnable(runnable) {
    if (runnable?.getClass && runnable.isExtending('Runnable')) {
      this.runnableList[runnable.name] = runnable;
    }
    return runnable;
  }

  /**
   * @param {Runnable} runnable
   * @return {this}
   */
  removeRunnable(runnable) {
    if (runnable && this.runnableList[runnable.name]) {
      delete this.runnableList[runnable.name];
    }
    return this;
  }

  /**
   * @param {String} name
   * @return {this}
   */
  removeRunnableByName(name) {
    return this.removeRunnable({ name });
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
      this.physicRunnable.step(this.$frame);
    }
    return this;
  }

  /**
   * @return {this}
   */
  start() {
    if (!this.$running) {
      this.$fpsInterval = 1000 / this.fps;
      this.$then = Date.now();
      this.$startTime = this.$then;
      this.$running = true;
      this.task();
    }
    return this;
  }

  /**
   * @return {this}
   */
  pause() {
    this.paused = true;
    this.emit('paused');
    return this;
  }

  /**
   * @return {this}
   */
  resume() {
    this.paused = false;
    this.emit('resumed');
    return this;
  }

  /**
   * @return {this}
   */
  togglePause() {
    return (this.paused ? this.resume() : this.pause());
  }

  stop() {
    window.cancelAnimationFrame(this.$frame);
    this.$running = false;
    this.paused = false;
    this.$frame = null;
    this.$fps = 0;
  }
}
