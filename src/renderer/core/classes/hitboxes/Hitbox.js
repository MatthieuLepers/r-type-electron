import Point from '@renderer/core/classes/geometry/Point';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';
import Rectangle from '@renderer/core/classes/geometry/Rectangle';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Hitbox {
  /**
   * @constructor
   * @param {Object} bounds
   * @param {Object} options
   */
  constructor(bounds, options = {}) {
    if (this.constructor.name === 'Hitbox') {
      throw new AbstractClassError(this);
    }
    this.bounds = { x: 0, y: 0, width: 0, height: 0, rotation: 0 };
    this.colliding = false;
    this.collidingWith = [];
    this.options = {
      hull: false,
      weak: false,
    };

    Object.assign(this.bounds, bounds);
    Object.assign(this.options, options);
  }

  /**
   * @return {Point}
   */
  get centroid() {
    return this.polygon
      .reduce((acc, point) => acc.add(point.x, point.y), new Point(0, 0))
      .scale(1 / this.polygon.length, 1 / this.polygon.length)
    ;
  }

  /**
   * @return {SVGPathElement}
   */
  getSvg() {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', this.toSvgPath());
    return path;
  }

  /**
   * @param {Hitbox} hitbox
   * @return {Boolean}
   */
  isColliding(hitbox) {
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

  /**
   * @return {Boolean}
   */
  isHull() {
    return this.options.hull;
  }

  /**
   * @return {Boolean}
   */
  isWeak() {
    return this.options.weak;
  }

  /**
   * @param {Hitbox} hitbox
   * @return {Rectangle}
   */
  getCollisionArea(hitbox) {
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
  render(ctx, id) {
    ctx.font = '10px Arial';
    ctx.fillStyle = '#f00';
    ctx.textAlign = 'left';
    ctx.fillText(id, this.bounds.x, this.bounds.y - 8);
    ctx.strokeStyle = '#f00';
    ctx.stroke(new Path2D(this.toSvgPath()));
    this.centroid.render(ctx);
  }
}
