import Path from '@renderer/core/classes/paths/Path';
import LinePath from '@renderer/core/classes/paths/LinePath';
import ArcPath from '@renderer/core/classes/paths/ArcPath';
import BezierCurvePath from '@renderer/core/classes/paths/BezierCurvePath';
import QuadraticBezierCurvePath from '@renderer/core/classes/paths/QuadraticBezierCurvePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ComplexePath extends Path {
  /**
   * @constructor
   * @param {Point} startPoint
   */
  constructor(startPoint) {
    super(startPoint);
    this.pathCollection = [];
  }

  /**
   * @param {Path} path
   * @return {this}
   */
  addPath(path) {
    path.startPoint = this.endPoint;
    this.pathCollection.push(path);
    return this;
  }

  /**
   * @return {Point}
   */
  get endPoint() {
    let lastPoint = this.startPoint;
    if (this.pathCollection.length) {
      const [p] = this.pathCollection.slice(-1);
      lastPoint = p.endPoint;
    }
    return lastPoint.clone();
  }

  /**
   * @return {String}
   */
  toSvgPath() {
    const strTab = [super.toSvgPath()];
    this.pathCollection.forEach((path) => { strTab.push(path.toSvgPath().split(' ').slice(-1)); });
    return strTab.join(' ');
  }

  /**
   * @param {Number} angle
   * @param {Point} pivot
   */
  rotate(angle, pivot) {
    this.pathCollection.forEach((path) => { path.rotate(angle, pivot); });
    return this;
  }

  /**
   * @param {String} d
   * @return {ComplexePath}
   */
  static fromSvgString(d) {
    let toParse = d;
    const regexPath = /(^M ?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const regexLinePath = /(^L ?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const regexArcPath = /(^A ?[0-9.]+[, ]?[0-9.]+[, ]?[0-9.]+[, ]?[0-9.]+[, ]?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const regexBezierCurvePath = /(^C ?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const regexQuadraticBezierCurvePath = /(^Q ?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const complexePath = new ComplexePath(null);

    while (toParse.length) {
      if (regexPath.test(toParse)) { // M dx dy
        const dataPath = toParse.replace(regexPath, '$1');
        toParse = toParse.replace(regexPath, '$2');
        if (!complexePath.startPoint) {
          complexePath.startPoint = Path.fromSvgString(dataPath).startPoint;
        }
      } else if (regexLinePath.test(toParse)) { // L dx dy
        const dataPath = toParse.replace(regexLinePath, '$1');
        toParse = toParse.replace(regexLinePath, '$2');
        complexePath.addPath(LinePath.fromSvgString(dataPath));
      } else if (regexArcPath.test(toParse)) { // A radiusX radiusY rotation largeArc sweepFlag dx dy
        const dataPath = toParse.replace(regexArcPath, '$1');
        toParse = toParse.replace(regexArcPath, '$2');
        complexePath.addPath(ArcPath.fromSvgString(dataPath));
      } else if (regexBezierCurvePath.test(toParse)) { // C x1 y1 x2 y2 dx dy
        const dataPath = toParse.replace(regexBezierCurvePath, '$1');
        toParse = toParse.replace(regexBezierCurvePath, '$2');
        complexePath.addPath(BezierCurvePath.fromSvgString(dataPath));
      } else if (regexQuadraticBezierCurvePath.test(toParse)) { // Q x1 y1 dx dy
        const dataPath = toParse.replace(regexQuadraticBezierCurvePath, '$1');
        toParse = toParse.replace(regexQuadraticBezierCurvePath, '$2');
        complexePath.addPath(QuadraticBezierCurvePath.fromSvgString(dataPath));
      } else { // error
        throw new Error(`Unable to parse SVG path from string '${toParse}'`);
      }
    }

    return complexePath;
  }

  /**
   * @param {Point} endPoint
   * @return {this}
   */
  addLinePath(endPoint) {
    this.addPath(new LinePath(null, endPoint));
    return this;
  }

  /**
   * @param {Number} radiusX
   * @param {Number} radiusY
   * @param {Number} rotation - degree
   * @param {Boolean} largeArc
   * @param {Boolean} sweepFlag
   * @param {Point} endPoint
   */
  addArcPath(radiusX, radiusY, rotation, largeArc, sweepFlag, endPoint) {
    this.addPath(new ArcPath(null, radiusX, radiusY, rotation, largeArc, sweepFlag, endPoint));
    return this;
  }

  /**
   * @param {Point} firstCtrlPoint
   * @param {Point} secondCtrlPoint
   * @param {Point} endPoint
   */
  addBezierCurvePath(firstCtrlPoint, secondCtrlPoint, endPoint) {
    this.addPath(new BezierCurvePath(null, firstCtrlPoint, secondCtrlPoint, endPoint));
    return this;
  }

  /**
   * @param {Point} ctrlPoint
   * @param {Point} endPoint
   */
  addQuadraticBezierCurvePath(ctrlPoint, endPoint) {
    this.addPath(new QuadraticBezierCurvePath(null, ctrlPoint, endPoint));
    return this;
  }

  /**
   * @return {ComplexePath}
   */
  makeNextLoop() {
    return this.moveTo(this.endPoint);
  }

  /**
   * @param {Point} startPoint
   * @return {ComplexePath}
   */
  moveTo(startPoint) {
    const movedPath = new ComplexePath(startPoint);
    const deltaPoint = this.startPoint.delta(startPoint);
    this.pathCollection.forEach((path) => { movedPath.addPath(path.moveTo(deltaPoint)); });
    return movedPath;
  }
}
