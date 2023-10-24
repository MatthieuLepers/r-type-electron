/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Point {
  /**
   * @constructor
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @return {this}
   */
  add(x = 0, y = 0) {
    this.x += x;
    this.y += y;
    return this;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @return {this}
   */
  scale(x = 1, y = 1) {
    this.x *= x;
    this.y *= y;
    return this;
  }

  /**
   * @param {Point} point
   * @return {Number}
   */
  getDistanceTo(point) {
    return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
  }

  /**
   * @param {Point} point
   * @return {Number}
   */
  getHorizontaleDistanceTo(point) {
    return Math.max(this.x, point.x) - Math.min(this.x, point.x);
  }

  /**
   * @param {Point} point
   * @return {Number}
   */
  getVerticaleDistanceTo(point) {
    return Math.max(this.y, point.y) - Math.min(this.y, point.y);
  }

  /**
   * @param {Point} point
   * @return {Number}
   */
  getAngleTo(point) {
    const signX = this.x - point.x >= 0 ? -1 : 1;
    const signY = this.y - point.y >= 0 ? -1 : 1;
    const angle = (Math.atan2(this.getVerticaleDistanceTo(point), this.getHorizontaleDistanceTo(point)) * 180) / Math.PI;
    return (signX >= 0 ? 180 + signY * angle : 360 - signY * angle) % 360;
  }

  /**
   * @return {Point}
   */
  clone() {
    const { x, y } = this;
    return new Point(x, y);
  }

  /**
   * @param {Point} point
   * @return {Point}
   */
  delta(point) {
    return new Point(point.x - this.x, point.y - this.y);
  }

  /**
   * @param {Number} angle
   * @param {Point} pivot
   * @return {this}
   */
  rotate(angle, pivot) {
    const angleRad = (angle * Math.PI) / 180;
    const newX = parseFloat(((Math.cos(angleRad) * (this.x - pivot.x)) - (Math.sin(angleRad) * (this.y - pivot.y)) + pivot.x).toFixed(3));
    const newY = parseFloat(((Math.sin(angleRad) * (this.x - pivot.x)) + (Math.cos(angleRad) * (this.y - pivot.y)) + pivot.y).toFixed(3));

    this.x = newX;
    this.y = newY;

    return this;
  }

  /**
   * @param {Number} gridX
   * @param {Number} gridY
   * @param {Number} deltaX
   * @param {Number} deltaY
   * @return {this}
   */
  placeOnGrid(gridX, gridY, deltaX = 0, deltaY = 0) {
    const newX = Math.floor(this.x / gridX) * gridX;
    const newY = Math.floor(this.y / gridY) * gridY;
    this.x = newX + deltaX;
    this.y = newY + deltaY;

    return this;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x - 5, this.y - 5);
    ctx.lineTo(this.x + 5, this.y + 5);
    ctx.strokeStyle = '#f00';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x - 5, this.y + 5);
    ctx.lineTo(this.x + 5, this.y - 5);
    ctx.strokeStyle = '#f00';
    ctx.stroke();
  }
}
