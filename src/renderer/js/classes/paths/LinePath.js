import Path from './Path';
import Point from '../geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class LinePath extends Path {
  /**
   * @constructor
   * @param {Point} startPoint
   * @param {Point} endPoint
   */
  constructor(startPoint, endPoint) {
    super(startPoint);
    this.endPoint = endPoint;
  }

  /**
   * @return {String}
   */
  toSvgPath() {
    return `${super.toSvgPath()} L${this.endPoint.x},${this.endPoint.y}`;
  }

  /**
   * @param {Number} angle
   * @param {Point} pivot
   */
  rotate(angle, pivot) {
    super.rotate(angle, pivot);
    this.endPoint.rotate(angle, pivot);
    return this;
  }

  /**
   * @param {String} d
   * @param {Point} startPoint
   * @return {LinePath}
   */
  static fromSvgString(d, startPoint = null) {
    const regex = /L\s*(-?[0-9.]+),?\s*(-?[0-9.]+)/;
    const [dx, dy] = d.replace(regex, '$1,$2').split(',').map(t => parseFloat(t));
    return new LinePath(startPoint, new Point(dx, dy));
  }

  /**
   * @param {Point} deltaPoint
   * @return {LinePath}
   */
  moveTo(deltaPoint) {
    return new LinePath(
      this.startPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.endPoint.clone().add(deltaPoint.x, deltaPoint.y),
    );
  }
}
