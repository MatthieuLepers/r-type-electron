import Path from '@renderer/core/classes/paths/Path';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ArcPath extends Path {
  constructor(
    startPoint: Point | undefined,
    public radiusX: number,
    public radiusY: number,
    public rotation: number, // degree
    public largeArc: boolean,
    public sweepFlag: boolean,
    public endPoint: Point,
  ) {
    super(startPoint);
  }

  toSvgPath(): string {
    return `${super.toSvgPath()}A${this.radiusX},${this.radiusY},${this.rotation},${+this.largeArc},${+this.sweepFlag},${this.endPoint.x},${this.endPoint.y}`;
  }

  rotate(angle: number, pivot: Point): ArcPath {
    super.rotate(angle, pivot);
    this.endPoint.rotate(angle, pivot);
    return this;
  }

  static fromSvgString(d: string, startPoint?: Point): ArcPath {
    const regex = /^A ?([0-9.]+)[, ]?([0-9.]+)[, ]?([0-9.]+)[, ]?([0-9.]+)[, ]?([0-9.]+)[, ]?(-?[0-9.]+)[, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [radiusX, radiusY, rotation, largeArc, sweepFlag, dx, dy] = d.replace(regex, '$1,$2,$3,$4,$5,$6,$7').split(',').map((t) => parseFloat(t));
    return new ArcPath(startPoint, radiusX, radiusY, rotation, largeArc === 1, sweepFlag === 1, new Point(dx, dy));
  }

  moveTo(deltaPoint: Point): ArcPath {
    return new ArcPath(
      this.startPoint?.clone()?.add(deltaPoint.x, deltaPoint.y),
      this.radiusX,
      this.radiusY,
      this.rotation,
      this.largeArc,
      this.sweepFlag,
      this.endPoint.clone().add(deltaPoint.x, deltaPoint.y),
    );
  }
}
