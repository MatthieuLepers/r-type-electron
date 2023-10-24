import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Path {
  /**
   * @constructor
   * @param {Point} startPoint
   */
  constructor(startPoint) {
    this.startPoint = startPoint;
  }

  /**
   * @return {String}
   */
  toSvgPath() {
    return `M${this.startPoint.x},${this.startPoint.y}`;
  }

  /**
   * @param {Number} angle
   * @param {Point} pivot
   */
  rotate(angle, pivot) {
    this.startPoint.rotate(angle, pivot);
    return this;
  }

  /**
   * @return {SVGElement}
   */
  get path() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', this.toSvgPath());
    svg.appendChild(path);
    return path;
  }

  /**
   * @param {String} d
   * @return {String}
   */
  static fromSvgString(d) {
    const regex = /^M ?(-?[0-9.]+)[, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [dx, dy] = d.replace(regex, '$1,$2').split(',').map((t) => parseFloat(t));
    return new Path(new Point(dx, dy));
  }

  /**
   * @param {Float} percent - [0-1]
   * @return {Point}
   */
  getPointAtPercent(percent) {
    const p = (percent > 1.0 ? 1.0 : percent);
    const { x, y } = this.path.getPointAtLength(this.path.getTotalLength() * p);
    return new Point(x, y);
  }

  /**
   * @return {Float}
   */
  getTotalLength() {
    return this.path.getTotalLength();
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  debugDraw(ctx) {
    ctx.strokeStyle = '#f00';
    ctx.stroke(new Path2D(this.toSvgPath()));
  }
}
