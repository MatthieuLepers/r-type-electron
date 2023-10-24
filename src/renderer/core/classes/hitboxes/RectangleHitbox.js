import Hitbox from '@renderer/core/classes/hitboxes/Hitbox';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class RectangleHitbox extends Hitbox {
  /**
   * @return {String}
   */
  toSvgPath() {
    const polygon = (this.bounds.rotation === 0 ? this.polygon : this.polygon.map((point) => point.rotate(this.bounds.rotation, this.centroid)));
    const first = polygon.shift();

    return `M ${first.x} ${first.y}${polygon.map((point) => ` L ${point.x} ${point.y}`).join('')} L ${first.x} ${first.y} Z`;
  }

  /**
   * @return {Point[]}
   */
  get polygon() {
    return [
      new Point(this.bounds.x, this.bounds.y),
      new Point(this.bounds.x + this.bounds.width, this.bounds.y),
      new Point(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height),
      new Point(this.bounds.x, this.bounds.y + this.bounds.height),
    ];
  }
}
