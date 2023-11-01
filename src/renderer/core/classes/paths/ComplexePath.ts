import Path from '@renderer/core/classes/paths/Path';
import LinePath from '@renderer/core/classes/paths/LinePath';
import ArcPath from '@renderer/core/classes/paths/ArcPath';
import BezierCurvePath from '@renderer/core/classes/paths/BezierCurvePath';
import QuadraticBezierCurvePath from '@renderer/core/classes/paths/QuadraticBezierCurvePath';
import type Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ComplexePath extends Path {
  public pathCollection: Array<LinePath | ArcPath | BezierCurvePath | QuadraticBezierCurvePath> = [];

  addPath(path: LinePath | ArcPath | BezierCurvePath | QuadraticBezierCurvePath): ComplexePath {
    path.startPoint = this.endPoint;
    this.pathCollection.push(path);
    return this;
  }

  get endPoint(): Point | undefined {
    let lastPoint = this.startPoint;
    if (this.pathCollection.length) {
      const [p] = this.pathCollection.slice(-1);
      lastPoint = p.endPoint;
    }
    return lastPoint?.clone();
  }

  toSvgPath(): string {
    const strTab = [super.toSvgPath()];
    this.pathCollection.forEach((path) => {
      strTab.push(...path.toSvgPath().split(' ').slice(-1));
    });
    return strTab.join(' ');
  }

  rotate(angle: number, pivot: Point): ComplexePath {
    this.pathCollection.forEach((path) => { path.rotate(angle, pivot); });
    return this;
  }

  /**
   * @param {String} d
   * @return {ComplexePath}
   */
  static fromSvgString(d: string): ComplexePath {
    let toParse = d;
    const regexPath = /(^M ?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const regexLinePath = /(^L ?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const regexArcPath = /(^A ?[0-9.]+[, ]?[0-9.]+[, ]?[0-9.]+[, ]?[0-9.]+[, ]?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const regexBezierCurvePath = /(^C ?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const regexQuadraticBezierCurvePath = /(^Q ?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+[, ]?-?[0-9.]+) ?(.*)/;
    const complexePath = new ComplexePath(undefined);

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

  addLinePath(endPoint: Point): ComplexePath {
    this.addPath(new LinePath(undefined, endPoint));
    return this;
  }

  addArcPath(
    radiusX: number,
    radiusY: number,
    rotation: number, // degree
    largeArc: boolean,
    sweepFlag: boolean,
    endPoint: Point,
  ): ComplexePath {
    this.addPath(new ArcPath(undefined, radiusX, radiusY, rotation, largeArc, sweepFlag, endPoint));
    return this;
  }

  addBezierCurvePath(
    firstCtrlPoint: Point,
    secondCtrlPoint: Point,
    endPoint: Point,
  ): ComplexePath {
    this.addPath(new BezierCurvePath(undefined, firstCtrlPoint, secondCtrlPoint, endPoint));
    return this;
  }

  addQuadraticBezierCurvePath(
    ctrlPoint: Point,
    endPoint: Point,
  ): ComplexePath {
    this.addPath(new QuadraticBezierCurvePath(undefined, ctrlPoint, endPoint));
    return this;
  }

  makeNextLoop(): ComplexePath {
    return this.moveTo(this.endPoint!);
  }

  moveTo(startPoint: Point): ComplexePath {
    const movedPath = new ComplexePath(startPoint);
    const deltaPoint = this.startPoint?.delta(startPoint);
    if (deltaPoint) {
      this.pathCollection.forEach((path) => {
        movedPath.addPath(path.moveTo(deltaPoint));
      });
    }
    return movedPath;
  }
}
