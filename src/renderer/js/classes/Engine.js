import Class from './Class';
import EventEmitter from './components/EventEmitter';

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
    this.$frame = null;

    this.$fps = 60;
    this.$fpsCounter = 0;
    this.$timer = window.setInterval(() => {
      this.$fps = this.$fpsCounter;
      this.$fpsCounter = 0;
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
    return this.$fps;
  }

  /**
   * @return {String}
   */
  get FPS_COLOR() {
    if (this.FPS >= 55) {
      return '#0f0';
    }
    if (this.FPS < 30) {
      return '#f00';
    }
    return '#ff7c00';
  }

  /**
   * @return {String}
   */
  get elapsedTime() {
    const seconds = Math.floor(this.FRAME / 60);
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
    if (runnable && runnable.getClass && runnable.isExtending('Runnable')) {
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
    if (!this.paused) {
      this.step();
      this.$fpsCounter += 1;
    }
    this.$frame = window.requestAnimationFrame(this.task.bind(this));
  }

  step() {
    Object
      .values(this.runnableList)
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
      this.$running = true;
      this.$frame = window.requestAnimationFrame(this.task.bind(this));
    }
    return this;
  }

  /**
   * @return {this}
   */
  pause() {
    this.paused = true;
    return this;
  }

  /**
   * @return {this}
   */
  resume() {
    this.paused = false;
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
