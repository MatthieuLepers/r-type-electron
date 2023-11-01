import Point from '@renderer/core/classes/geometry/Point';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';
import Rectangle from '@renderer/core/classes/geometry/Rectangle';

export interface IHitboxOptions {
  hull: boolean;
  weak: boolean;
}

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default abstract class Hitbox {
  public bounds: Rectangle = new Rectangle(0, 0, 0, 0, 0);

  public colliding: boolean = false;

  public collidingWith: Array<Hitbox> = [];

  public options: IHitboxOptions = {
    hull: false,
    weak: false,
  };

  constructor(
    bounds: Rectangle,
    options = {},
  ) {
    if (this.constructor.name === 'Hitbox') {
      throw new AbstractClassError(this);
    }
    this.bounds = bounds;

    Object.assign(this.options, options);
  }

  get centroid(): Point {
    return this.polygon
      .reduce((acc, point) => acc.add(point.x, point.y), new Point(0, 0))
      .scale(1 / this.polygon.length, 1 / this.polygon.length)
    ;
  }

  abstract get polygon(): Array<Point>;

  abstract toSvgPath(): string;

  getSvg(): SVGPathElement {
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

    return new Rectangle(maxLeft, minTop, minRight - maxLeft, maxBottom - minTop);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {String} id
   */
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
