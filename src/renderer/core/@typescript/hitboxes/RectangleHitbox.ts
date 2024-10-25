import Hitbox from '@renderer/core/@typescript/hitboxes/Hitbox';
import Point from '@renderer/core/@typescript/geometry/Point';

export default class RectangleHitbox extends Hitbox {
  toSvgPath(): string {
    const polygon = (this.bounds.rotation === 0 ? this.polygon : this.polygon.map((point) => point.rotate(this.bounds.rotation, this.centroid)));
    const first = polygon.shift()!;

    return `M ${first.x} ${first.y}${polygon.map((point) => ` L ${point.x} ${point.y}`).join('')} L ${first.x} ${first.y} Z`;
  }

  get centroid(): Point {
    return this.polygon
      .reduce((acc, point) => acc.add(point.x, point.y), new Point(0, 0))
      .scale(1 / this.polygon.length, 1 / this.polygon.length)
    ;
  }

  get polygon(): Array<Point> {
    return [
      new Point(this.bounds.x, this.bounds.y),
      new Point(this.bounds.x + this.bounds.width, this.bounds.y),
      new Point(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height),
      new Point(this.bounds.x, this.bounds.y + this.bounds.height),
    ];
  }
}
