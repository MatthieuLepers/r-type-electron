import Class from '@renderer/core/classes/Class';
import Rectangle from '@renderer/core/classes/geometry/Rectangle';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Canvas extends Class {
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas
   * @param {Object} options
   */
  constructor(canvas, options) {
    super();
    this.options = {
      width: window.innerWidth,
      height: window.innerHeight - 80,
    };
    this.canvas = canvas;
    this.ctx = null;
    this.drawables = {};

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
   * @param {Drawable} drawable
   * @return {this}
   */
  addDrawable(drawable) {
    this.drawables[drawable.id] = drawable;
    return this;
  }

  /**
   * @param {String} drawableId
   * @return {this}
   */
  removeDrawable(drawableId) {
    if (this.drawables[drawableId]) {
      delete this.drawables[drawableId];
    }
    return this;
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
    Object
      .values(this.drawables)
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
