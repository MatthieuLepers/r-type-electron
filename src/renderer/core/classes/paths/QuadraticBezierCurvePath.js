import Path from '@renderer/core/classes/paths/Path';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class QuadraticBezierCurvePath extends Path {
  /**
   * @constructor
   * @param {Point} startPoint
   * @param {Point} ctrlPoint
   * @param {Point} endPoint
   */
  constructor(startPoint, ctrlPoint, endPoint) {
    super(startPoint);
    this.endPoint = endPoint;
    this.ctrlPoint = ctrlPoint;
  }

  /**
   * @return {String}
   */
  toSvgPath() {
    return `${super.toSvgPath()}Q${this.ctrlPoint.x},${this.ctrlPoint.y},${this.endPoint.x},${this.endPoint.y}`;
  }

  /**
   * @param {Number} angle
   * @param {Point} pivot
   */
  rotate(angle, pivot) {
    super.rotate(angle, pivot);
    this.ctrlPoint.rotate(angle, pivot);
    this.endPoint.rotate(angle, pivot);
    return this;
  }

  /**
   * @param {String} d
   * @param {Point} startPoint
   * @return {QuadraticBezierCurvePath}
   */
  static fromSvgString(d, startPoint = null) {
    const regex = /^Q ?(-?[0-9.]+) [, ]?(-?[0-9.]+) [, ]?(-?[0-9.]+) [, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [x1, y1, dx, dy] = d.replace(regex, '$1,$2,$3,$4').split(',').map((t) => parseFloat(t));
    return new QuadraticBezierCurvePath(startPoint, new Point(x1, y1), new Point(dx, dy));
  }

  /**
   * @param {Point} deltaPoint
   * @return {QuadraticBezierCurvePath}
   */
  moveTo(deltaPoint) {
    return new QuadraticBezierCurvePath(
      this.startPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.ctrlPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.endPoint.clone().add(deltaPoint.x, deltaPoint.y),
    );
  }
}
