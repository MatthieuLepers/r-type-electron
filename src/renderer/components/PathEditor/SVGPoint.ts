import AnchorPoint from '@renderer/components/PathEditor/AnchorPoint';

export type PointType = 'M' | 'L' | 'C' | 'Q' | 'A';

export interface SVGPointOptions {
  x: number;
  y: number;
  type: PointType;
  radius: { x: number, y: number },
  rotation: number;
  largArc: boolean;
  sweep: boolean;
  r: number;
  prevPoint: SVGPoint | null;
  ctrlP1: AnchorPoint;
  crtlP2: AnchorPoint;
  ctrlP1R: AnchorPoint;
  ctrlP2R: AnchorPoint;
}

export default class SVGPoint {
  public $x: number = 0;

  public $y: number = 0;

  public $type: PointType = 'M';

  public radius: { x: number, y: number } = { x: 50, y: 50 };

  public rotation: number = 0;

  public largeArc: boolean = true;

  public sweep: boolean = true;

  public r: number = 0;

  public prevPoint: SVGPoint | null = null;

  public ctrlP1: AnchorPoint = new AnchorPoint({ x: 0, y: 0, svgPoint: this, reflect: 'ctrlP1R' });

  public ctrlP2: AnchorPoint = new AnchorPoint({ x: 0, y: 0, svgPoint: this, reflect: 'ctrlP2R' });

  public ctrlP1R: AnchorPoint = new AnchorPoint({ x: 0, y: 0, svgPoint: this, reflect: 'ctrlP1' });

  public ctrlP2R: AnchorPoint = new AnchorPoint({ x: 0, y: 0, svgPoint: this, reflect: 'ctrlP2' });

  constructor(options: Partial<SVGPointOptions>) {
    Object.assign(this, options);
  }

  toSvgString(): string {
    if (this.type === 'L') {
      return `L${this.x},${this.y}`;
    }
    if (this.type === 'C') {
      return `C${this.ctrlP1.x},${this.ctrlP1.y},${this.ctrlP2.x},${this.ctrlP2.y},${this.x},${this.y}`;
    }
    if (this.type === 'Q') {
      return `Q${this.ctrlP1.x},${this.ctrlP1.y},${this.x},${this.y}`;
    }
    if (this.type === 'A') {
      return `A${this.radius.x},${this.radius.y},${this.rotation},${+this.largeArc},${+this.sweep},${this.x},${this.y}`;
    }
    return '';
  }

  get type(): PointType {
    return this.$type;
  }

  set type(type: PointType) {
    if (this.$type !== type) {
      this.$type = type;

      if (this.prevPoint) {
        if (this.$type === 'Q') {
          const distance = this.getDistanceTo(this.prevPoint);
          this.ctrlP1.x = this.x - Math.floor(distance.x / 2);
          this.ctrlP1.y = this.y - Math.floor(distance.y / 2);
        } else if (this.$type === 'C') {
          const distance = this.getDistanceTo(this.prevPoint);

          this.ctrlP1.x = this.prevPoint.x + Math.floor(distance.x / 3);
          this.ctrlP1.y = this.prevPoint.y + Math.floor(distance.y / 2);
          this.ctrlP2.x = this.x - Math.floor(distance.x / 3);
          this.ctrlP2.y = this.y - Math.floor(distance.y / 2);
        }
      }
    }
  }

  get x(): number {
    return this.$x;
  }

  set x(x: number) {
    this.$x = x;

    this.ctrlP1.updateReflect();
    this.ctrlP1.updateReflect();
    this.ctrlP2.updateReflect();
  }

  get y(): number {
    return this.$y;
  }

  set y(y: number) {
    this.$y = y;

    this.ctrlP1.updateReflect();
    this.ctrlP2.updateReflect();
  }

  getDistanceTo(other: SVGPoint | AnchorPoint | null): { x: number, y: number } {
    if (other) {
      return {
        x: Math.floor(this.x - other.x),
        y: Math.floor(this.y - other.y),
      };
    }
    return { x: 0, y: 0 };
  }
}
