import Path from '@renderer/core/classes/paths/Path';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class BezierCurvePath extends Path {
  /**
   * @constructor
   * @param {Point} startPoint
   * @param {Point} firstCtrlPoint
   * @param {Point} secondCtrlPoint
   * @param {Point} endPoint
   */
  constructor(startPoint, firstCtrlPoint, secondCtrlPoint, endPoint) {
    super(startPoint);
    this.endPoint = endPoint;
    this.firstCtrlPoint = firstCtrlPoint;
    this.secondCtrlPoint = secondCtrlPoint;
  }

  /**
   * @return {String}
   */
  toSvgPath() {
    return `${super.toSvgPath()}C${this.firstCtrlPoint.x},${this.firstCtrlPoint.y},${this.secondCtrlPoint.x},${this.secondCtrlPoint.y},${this.endPoint.x},${this.endPoint.y}`;
  }

  /**
   * @param {Number} angle
   * @param {Point} pivot
   */
  rotate(angle, pivot) {
    super.rotate(angle, pivot);
    this.firstCtrlPoint.rotate(angle, pivot);
    this.secondCtrlPoint.rotate(angle, pivot);
    this.endPoint.rotate(angle, pivot);
    return this;
  }

  /**
   * @param {String} d
   * @param {Point} startPoint
   * @return {BezierCurvePath}
   */
  static fromSvgString(d, startPoint = null) {
    const regex = /^C ?(-?[0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [x1, y1, x2, y2, dx, dy] = d.replace(regex, '$1,$2,$3,$4,$5,$6').split(',').map((t) => parseFloat(t));
    return new BezierCurvePath(startPoint, new Point(x1, y1), new Point(x2, y2), new Point(dx, dy));
  }

  /**
   * @param {Point} deltaPoint
   * @return {BezierCurvePath}
   */
  moveTo(deltaPoint) {
    return new BezierCurvePath(
      this.startPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.firstCtrlPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.secondCtrlPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.endPoint.clone().add(deltaPoint.x, deltaPoint.y),
    );
  }
}
