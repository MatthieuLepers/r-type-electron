/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Rectangle {
  /**
   * @constructor
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Number} rotation
   */
  constructor(x, y, width, height, rotation = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#f00';
    ctx.stroke();
  }
}
