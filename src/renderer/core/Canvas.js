import Rectangle from '@renderer/core/classes/geometry/Rectangle';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Canvas {
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas
   * @param {Object} options
   */
  constructor(canvas, options) {
    this.options = {
      width: window.innerWidth,
      height: window.innerHeight - 80,
    };
    this.canvas = canvas;
    this.ctx = null;
    this.drawables = new Map();

    Object.assign(this.options, options);
    this.init();
  }

  init() {
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.strokeStyle = '#f00';

    window.addEventListener('resize', () => {
      this.options.width = window.innerWidth;
      this.options.height = window.innerHeight;
      this.canvas.width = this.options.width;
      this.canvas.height = this.options.height;
    });
  }

  /**
   * @param {DrawableComponent} drawableComponent
   * @return {this}
   */
  addDrawable(drawable) {
    if (!this.drawables.get(drawable.inst)) {
      this.drawables.set(drawable.inst, []);
    }
    this.drawables.get(drawable.inst).push(drawable);
    return this;
  }

  /**
   * @param {EntityScript} entity
   * @return {this}
   */
  removeDrawables(entity) {
    if (this.drawables.has(entity)) {
      this.drawables.delete(entity);
    }
    return this;
  }

  /**
   * @param {DrawableComponent} entity
   * @return {this}
   */
  removeDrawable(drawable) {
    if (this.drawables.has(drawable.inst)) {
      this.drawables.set(drawable.inst, this.drawables.get(drawable.inst).filter((d) => d !== drawable));
    }
    return this;
  }

  /**
   * @return {Number}
   */
  get width() {
    return this.options.width;
  }

  /**
   * @return {Number}
   */
  get height() {
    return this.options.height;
  }

  /**
   * @return {Rectangle}
   */
  getBounds() {
    return new Rectangle(0, 0, this.options.width, this.options.height);
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @return {this}
   */
  clear(x, y, width, height) {
    this.ctx.clearRect(x ?? 0, y ?? 0, width ?? this.options.width, height ?? this.options.height);
    return this;
  }

  /**
   * @return {this}
   */
  render() {
    this.clear();
    [...this.drawables.values()]
      .reduce((acc, val) => [...acc, ...val], [])
      .sort((a, b) => a.priority - b.priority)
      .forEach((drawable) => { drawable.render(); })
    ;
    return this;
  }

  /**
   * @param {String} txt
   * @param {Number} x
   * @param {Number} y
   * @param {Object} styles
   */
  fillText(txt, x, y, styles = {}) {
    this.ctx.font = `${styles.fontSize ?? 16}px ${styles.fontFamily ?? 'Calibri'}`;
    this.ctx.fillStyle = styles.color ?? '#000';
    this.ctx.textAlign = styles.align ?? 'center';
    this.ctx.fillText(txt, x, y);
  }
}
