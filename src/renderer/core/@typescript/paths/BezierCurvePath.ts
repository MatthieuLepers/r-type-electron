import Path from '@renderer/core/@typescript/paths/Path';
import Point from '@renderer/core/@typescript/geometry/Point';

export default class BezierCurvePath extends Path {
  constructor(
    startPoint: Point | undefined,
    public firstCtrlPoint: Point,
    public secondCtrlPoint: Point,
    public endPoint: Point,
  ) {
    super(startPoint);
  }

  toSvgPath(): string {
    return `${super.toSvgPath()}C${this.firstCtrlPoint.x},${this.firstCtrlPoint.y},${this.secondCtrlPoint.x},${this.secondCtrlPoint.y},${this.endPoint.x},${this.endPoint.y}`;
  }

  rotate(angle: number, pivot: Point): BezierCurvePath {
    super.rotate(angle, pivot);
    this.firstCtrlPoint.rotate(angle, pivot);
    this.secondCtrlPoint.rotate(angle, pivot);
    this.endPoint.rotate(angle, pivot);
    return this;
  }

  static fromSvgString(d: string, startPoint?: Point): BezierCurvePath {
    const regex = /^C ?(-?[0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [x1, y1, x2, y2, dx, dy] = d.replace(regex, '$1,$2,$3,$4,$5,$6').split(',').map((t) => parseFloat(t));
    return new BezierCurvePath(startPoint, new Point(x1, y1), new Point(x2, y2), new Point(dx, dy));
  }

  moveTo(deltaPoint: Point): BezierCurvePath {
    return new BezierCurvePath(
      this.startPoint?.clone()?.add(deltaPoint.x, deltaPoint.y),
      this.firstCtrlPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.secondCtrlPoint.clone().add(deltaPoint.x, deltaPoint.y),
      this.endPoint.clone().add(deltaPoint.x, deltaPoint.y),
    );
  }
}
