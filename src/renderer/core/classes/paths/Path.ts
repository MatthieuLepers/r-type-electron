import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Path {
  constructor(public startPoint: Point | undefined) {}

  toSvgPath(): string {
    return `M${this.startPoint?.x},${this.startPoint?.y}`;
  }

  rotate(angle: number, pivot: Point): Path {
    this.startPoint?.rotate(angle, pivot);
    return this;
  }

  get path(): SVGGeometryElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', this.toSvgPath());
    svg.appendChild(path);
    return path;
  }

  static fromSvgString(d: string): Path {
    const regex = /^M ?(-?[0-9.]+)[, ]?(-?[0-9.]+)$/;
    if (!regex.test(d)) {
      throw new Error(`Unable to parse SVG path from string '${d}'`);
    }
    const [dx, dy] = d.replace(regex, '$1,$2').split(',').map((t) => parseFloat(t));
    return new Path(new Point(dx, dy));
  }

  getPointAtPercent(percent: number): Point {
    const p = (percent > 1.0 ? 1.0 : percent);
    const { x, y } = this.path.getPointAtLength(this.path.getTotalLength() * p);
    return new Point(x, y);
  }

  getTotalLength(): number {
    return this.path.getTotalLength();
  }

  debugDraw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#f00';
    ctx.stroke(new Path2D(this.toSvgPath()));
  }
}
