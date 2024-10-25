import Path from '@renderer/core/@typescript/paths/Path';
import Point from '@renderer/core/@typescript/geometry/Point';

export default class QuadraticBezierCurvePath extends Path {
  constructor(
    startPoint: Point | undefined,
    public ctrlPoint: Point,
    public endPoint: Point,
  ) {
    super(startPoint);
  }

  toSvgPath(): string {
    return `${super.toSvgPath()}Q${this.ctrlPoint.x},${this.ctrlPoint.y},${this.endPoint.x},${this.endPoint.y}`;
  }

  rotate(angle: number, pivot: Point): QuadraticBezierCurvePath {
    super.rotate(angle, pivot);
    this.ctrlPoint.rotate(angle, pivot);
    this.endPoint.rotate(angle, pivot);
    return this;
  }

  static fromSvgString(d: string, startPoint?: Point): QuadraticBezierCurvePath {
    const regex = /^Q ?(-?[0-9.]+) [, ]?(-?[0-9.]+) [, ]?(-?[0-9.]+) [, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [x1, y1, dx, dy] = d.replace(regex, '$1,$2,$3,$4').split(',').map((t) => parseFloat(t));
    return new QuadraticBezierCurvePath(startPoint, new Point(x1, y1), new Point(dx, dy));
  }

  moveTo(deltaPoint: Point): QuadraticBezierCurvePath {
    return new QuadraticBezierCurvePath(
      this.startPoint?.clone()?.add(deltaPoint.x, deltaPoint.y),
      this.ctrlPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.endPoint.clone().add(deltaPoint.x, deltaPoint.y),
    );
  }
}
