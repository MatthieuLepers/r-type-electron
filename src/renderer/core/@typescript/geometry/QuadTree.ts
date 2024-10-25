import Point from '@renderer/core/@typescript/geometry/Point';
import Rectangle from '@renderer/core/@typescript/geometry/Rectangle';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export default class QuadTree {
  public objectList: Array<EntityScript> = [];

  public nodes: Array<QuadTree> = [];

  constructor(
    public level: number,
    public bounds: Rectangle,
  ) {}

  get MAX_OBJECTS(): number {
    return 10;
  }

  get MAX_LEVELS(): number {
    return 5;
  }

  clear() {
    this.objectList = [];
    this.nodes.forEach((node) => { node.clear(); });
    this.nodes = [];
  }

  split() {
    const subWidth = this.bounds.width / 2;
    const subHeight = this.bounds.height / 2;
    const { x, y } = this.bounds;

    this.nodes[0] = new QuadTree(this.level + 1, new Rectangle({
      x: x + subWidth,
      y,
      width: subWidth,
      height: subHeight,
    }));
    this.nodes[1] = new QuadTree(this.level + 1, new Rectangle({
      x,
      y,
      width: subWidth,
      height: subHeight,
    }));
    this.nodes[2] = new QuadTree(this.level + 1, new Rectangle({
      x,
      y: y + subHeight,
      width: subWidth,
      height: subHeight,
    }));
    this.nodes[3] = new QuadTree(this.level + 1, new Rectangle({
      x: x + subWidth,
      y: y + subHeight,
      width: subWidth,
      height: subHeight,
    }));
  }

  getIndex(entity: EntityScript): number {
    let index = -1;
    const midPoint = new Point(this.bounds.x + (this.bounds.width / 2), this.bounds.y + (this.bounds.height / 2));
    const topQuadrant = (entity.components.transform!.position.y < midPoint.y && entity.components.transform!.position.y + entity.components.sprite!.height < midPoint.y);
    const bottomQuadrant = (entity.components.transform!.position.y > midPoint.y);

    if (entity.components.transform!.position.x < midPoint.x && entity.components.transform!.position.x + entity.components.sprite!.width < midPoint.x) {
      if (topQuadrant) {
        index = 1;
      } else if (bottomQuadrant) {
        index = 2;
      }
    } else if (entity.components.transform!.position.x > midPoint.x) {
      if (topQuadrant) {
        index = 0;
      } else if (bottomQuadrant) {
        index = 3;
      }
    }

    return index;
  }

  insert(entity: EntityScript) {
    if (this.nodes[0]) {
      const index = this.getIndex(entity);

      if (index >= 0) {
        this.nodes[index].insert(entity);

        return;
      }
    }

    this.objectList.push(entity);

    if (this.objectList.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
      if (!this.nodes[0]) {
        this.split();
      }

      let i = 0;
      while (i < this.objectList.length) {
        const index = this.getIndex(this.objectList[i]);

        if (index >= 0) {
          const [item] = this.objectList.splice(i, 1);
          this.nodes[index].insert(item);
        } else {
          i += 1;
        }
      }
    }
  }

  insertAll(entityList: Array<EntityScript>) {
    entityList.forEach((entity) => { this.insert(entity); });
  }

  retrieve(entityToCheckCollision: EntityScript): Array<EntityScript> {
    let returnObjects: Array<EntityScript> = [];
    const index = this.getIndex(entityToCheckCollision);

    if (index >= 0 && this.nodes[index]) {
      returnObjects = returnObjects.concat(this.nodes[index].retrieve(entityToCheckCollision));
    }

    return returnObjects.concat(this.objectList);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.bounds.render(ctx);
    this.nodes.forEach((node) => { node.render(ctx); });
  }
}
