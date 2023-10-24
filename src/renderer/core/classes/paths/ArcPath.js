import Path from '@renderer/core/classes/paths/Path';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ArcPath extends Path {
  /**
   * @constructor
   * @param {Point} startPoint
   * @param {Number} radiusX
   * @param {Number} radiusY
   * @param {Number} rotation - degree
   * @param {Boolean} largeArc
   * @param {Boolean} sweepFlag
   * @param {Point} endPoint
   */
  constructor(startPoint, radiusX, radiusY, rotation, largeArc, sweepFlag, endPoint) {
    super(startPoint);
    this.endPoint = endPoint;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.rotation = rotation;
    this.largeArc = largeArc;
    this.sweepFlag = sweepFlag;
  }

  /**
   * @return {String}
   */
  toSvgPath() {
    return `${super.toSvgPath()}A${this.radiusX},${this.radiusY},${this.rotation},${+this.largeArc},${+this.sweepFlag},${this.endPoint.x},${this.endPoint.y}`;
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
   * @return {ArcPath}
   */
  static fromSvgString(d, startPoint = null) {
    const regex = /^A ?([0-9.]+)[, ]?([0-9.]+)[, ]?([0-9.]+)[, ]?([0-9.]+)[, ]?([0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [radiusX, radiusY, rotation, largeArc, sweepFlag, dx, dy] = d.replace(regex, '$1,$2,$3,$4,$5,$6,$7').split(',').map((t) => parseFloat(t));
    return new ArcPath(startPoint, radiusX, radiusY, rotation, largeArc === 1, sweepFlag === 1, new Point(dx, dy));
  }

  /**
   * @param {Point} deltaPoint
   * @return {ArcPath}
   */
  moveTo(deltaPoint) {
    return new ArcPath(
      this.startPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.radiusX,
      this.radiusY,
      this.rotation,
      this.largeArc,
      this.sweepFlag,
      this.endPoint.clone().add(deltaPoint.x, deltaPoint.y),
    );
  }
}
