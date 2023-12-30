import SVGPoint from '@renderer/components/PathEditor/SVGPoint';

export interface AnchorPointOptions {
  x: number;
  y: number;
  reflect: string;
  svgPoint: SVGPoint | null;
}

export default class AnchorPoint {
  public reflect: string = '';

  public $x: number = 0;

  public $y: number = 0;

  public svgPoint: SVGPoint | null = null;

  public anchor: boolean = true;

  constructor(options: AnchorPointOptions) {
    Object.assign(this, options);
  }

  get x(): number {
    return this.$x;
  }

  set x(x: number) {
    this.$x = x;

    if (this.svgPoint) {
      const distance = this.svgPoint.getDistanceTo(this);
      this.svgPoint[this.reflect].$x = this.svgPoint.x + distance.x;
    }
  }

  get y(): number {
    return this.$y;
  }

  set y(y: number) {
    this.$y = y;

    if (this.svgPoint) {
      const distance = this.svgPoint.getDistanceTo(this);
      this.svgPoint[this.reflect].$y = this.svgPoint.y + distance.y;
    }
  }

  updateReflect() {
    if (this.svgPoint) {
      const distance = this.svgPoint.getDistanceTo(this);
      this.svgPoint[this.reflect].$x = this.svgPoint.x + distance.x;
      this.svgPoint[this.reflect].$y = this.svgPoint.y + distance.y;
    }
  }
}
