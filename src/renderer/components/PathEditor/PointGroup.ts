import SVGPoint, { type PointType } from '@renderer/components/PathEditor/SVGPoint';

export interface PointGroupOptions {
  closePath: boolean,
  hidePoints: boolean,
  strokeStyle: string,
  stroke: boolean,
  fillStyle: string,
  fill: boolean,
  pointRadius: number,
  anchorRadius: number,
}

export default class PointGroup {
  public name: string = '';

  public edit: boolean = false;

  public settings: PointGroupOptions = {
    closePath: false,
    hidePoints: false,
    strokeStyle: '#000',
    stroke: true,
    fillStyle: 'rgba(0, 255, 128, 0.15)',
    fill: true,
    pointRadius: 8,
    anchorRadius: 6,
  };

  public start: SVGPoint;

  public points: Array<SVGPoint> = [];

  constructor(x: number, y: number, settings: PointGroupOptions) {
    Object.assign(this.settings, settings);

    this.start = new SVGPoint({ x, y, r: this.settings.pointRadius });
  }

  toSvgString(): string {
    const { start, points } = this;
    return `M${start.x},${start.y}${points.reduce((acc, val) => `${acc}${val.toSvgString()}`, '')}${this.settings.closePath ? 'Z' : ''}`;
  }

  addPoint(x: number, y: number, type: PointType): SVGPoint {
    const prevPoint = this.getLastPoint();
    const newPoint = new SVGPoint({ x, y, type, prevPoint, r: this.settings.pointRadius });
    this.points.push(newPoint);

    return newPoint;
  }

  removePoint(point: SVGPoint) {
    this.points.splice(this.points.indexOf(point), 1);
    this.points.forEach((p, i, all) => {
      p.prevPoint = (i === 0 ? this.start : all[i - 1]);
    });
  }

  getLastPoint(): SVGPoint {
    const len = this.points.length;
    return (!len ? this.start : this.points[len - 1]);
  }

  getPrevPointOf(point: SVGPoint): SVGPoint {
    const index = this.points.indexOf(point);
    return (index === 0 ? this.start : this.points[index - 1]);
  }

  getPrevPointTypeOf(point: SVGPoint): string {
    const prevPoint = this.getPrevPointOf(point);
    return (prevPoint ? prevPoint.type : '');
  }

  getNextPointOf(point: SVGPoint): SVGPoint | null {
    const index = this.points.indexOf(point);
    return (index === this.points.length - 1 ? null : this.points[index + 1]);
  }

  getNextPointTypeOf(point: SVGPoint): string {
    const nextPoint = this.getNextPointOf(point);
    return (nextPoint ? nextPoint.type : '');
  }
}
