import Path from '@renderer/core/classes/paths/Path';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class LinePath extends Path {
  constructor(
    startPoint: Point | undefined,
    public endPoint: Point,
  ) {
    super(startPoint);
  }

  toSvgPath(): string {
    return `${super.toSvgPath()}L${this.endPoint.x},${this.endPoint.y}`;
  }

  rotate(angle: number, pivot: Point): LinePath {
    super.rotate(angle, pivot);
    this.endPoint.rotate(angle, pivot);
    return this;
  }

  static fromSvgString(d: string, startPoint?: Point) {
    const regex = /^L ?(-?[0-9.]+)[, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [dx, dy] = d.replace(regex, '$1,$2').split(',').map((t) => parseFloat(t));
    return new LinePath(startPoint, new Point(dx, dy));
  }

  moveTo(deltaPoint: Point): LinePath {
    return new LinePath(
      this.startPoint?.clone()?.add(deltaPoint.x, deltaPoint.y),
      this.endPoint.clone().add(deltaPoint.x, deltaPoint.y),
    );
  }
}
