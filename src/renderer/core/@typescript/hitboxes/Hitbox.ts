import Point from '@renderer/core/@typescript/geometry/Point';
import Rectangle, { IRectangle } from '@renderer/core/@typescript/geometry/Rectangle';

export interface IHitboxOptions {
  hull: boolean;
  weak: boolean;
}

export default abstract class Hitbox {
  public bounds: Rectangle = new Rectangle({ x: 0, y: 0, width: 0, height: 0 });

  public colliding: boolean = false;

  public collidingWith: Array<Hitbox> = [];

  public options: IHitboxOptions = {
    hull: false,
    weak: false,
  };

  constructor(bounds: IRectangle, options: Partial<IHitboxOptions> = {}) {
    this.bounds = new Rectangle(bounds);

    Object.assign(this.options, options);
  }

  abstract get centroid(): Point;

  abstract get polygon(): Array<Point>;

  abstract toSvgPath(): string;

  toSvgPathElement(): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', this.toSvgPath());
    return path;
  }

  isColliding(hitbox: Hitbox): boolean {
    const maxLeft = Math.max(this.bounds.x, hitbox.bounds.x);
    const minRight = Math.min(this.bounds.x + this.bounds.width, hitbox.bounds.x + hitbox.bounds.width);
    const maxBottom = Math.max(this.bounds.y, hitbox.bounds.y);
    const minTop = Math.min(this.bounds.y + this.bounds.height, hitbox.bounds.y + hitbox.bounds.height);

    const hasCollision = maxLeft < minRight && maxBottom < minTop;
    if (hasCollision) {
      this.colliding = true;
      this.collidingWith.push(hitbox);
      hitbox.colliding = true;
      hitbox.collidingWith.push(this);
    }
    return hasCollision;
  }

  isHull(): boolean {
    return this.options.hull;
  }

  isWeak(): boolean {
    return this.options.weak;
  }

  getCollisionArea(hitbox: Hitbox): Rectangle {
    const maxLeft = Math.max(this.bounds.x, hitbox.bounds.x);
    const minRight = Math.min(this.bounds.x + this.bounds.width, hitbox.bounds.x + hitbox.bounds.width);
    const maxBottom = Math.max(this.bounds.y, hitbox.bounds.y);
    const minTop = Math.min(this.bounds.y + this.bounds.height, hitbox.bounds.y + hitbox.bounds.height);

    return new Rectangle({
      x: maxLeft,
      y: minTop,
      width: minRight - maxLeft,
      height: maxBottom - minTop,
    });
  }

  render(ctx: CanvasRenderingContext2D, id: string) {
    ctx.font = '10px Arial';
    ctx.fillStyle = '#f00';
    ctx.textAlign = 'left';
    ctx.fillText(id, this.bounds.x, this.bounds.y - 8);
    ctx.strokeStyle = '#f00';
    ctx.stroke(new Path2D(this.toSvgPath()));
    this.centroid.render(ctx);
  }
}
