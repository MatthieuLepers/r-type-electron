import Point from '@renderer/core/classes/geometry/Point';
import Rectangle from '@renderer/core/classes/geometry/Rectangle';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class QuadTree {
  /**
   * @constructor
   * @param {Number} level
   * @param {Rectangle} bounds
   */
  constructor(level, bounds) {
    this.level = level;
    this.bounds = bounds;
    this.objectList = [];
    this.nodes = [];
  }

  /**
   * @return {Number}
   */
  get MAX_OBJECTS() {
    return 10;
  }

  /**
   * @return {Number}
   */
  get MAX_LEVELS() {
    return 5;
  }

  /**
   * Clear quadtree recursively
   */
  clear() {
    this.objectList = [];
    this.nodes.forEach((node) => { node.clear(); });
    this.nodes = [];
  }

  /**
   * Splits the node into 4 subnodes
   */
  split() {
    const subWidth = this.bounds.width / 2;
    const subHeight = this.bounds.height / 2;
    const { x, y } = this.bounds;

    this.nodes[0] = new QuadTree(this.level + 1, new Rectangle(x + subWidth, y, subWidth, subHeight));
    this.nodes[1] = new QuadTree(this.level + 1, new Rectangle(x, y, subWidth, subHeight));
    this.nodes[2] = new QuadTree(this.level + 1, new Rectangle(x, y + subHeight, subWidth, subHeight));
    this.nodes[3] = new QuadTree(this.level + 1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
  }

  /**
   * @param {EntityScript} entity
   * @return {Number}
   */
  getIndex(entity) {
    let index = -1;
    const midPoint = new Point(this.bounds.x + (this.bounds.width / 2), this.bounds.y + (this.bounds.height / 2));
    const topQuadrant = (entity.components.transform.position.y < midPoint.y && entity.components.transform.position.y + entity.getSprite().height < midPoint.y);
    const bottomQuadrant = (entity.components.transform.position.y > midPoint.y);

    if (entity.components.transform.position.x < midPoint.x && entity.components.transform.position.x + entity.getSprite().width < midPoint.x) {
      if (topQuadrant) {
        index = 1;
      } else if (bottomQuadrant) {
        index = 2;
      }
    } else if (entity.components.transform.position.x > midPoint.x) {
      if (topQuadrant) {
        index = 0;
      } else if (bottomQuadrant) {
        index = 3;
      }
    }

    return index;
  }

  /**
   * @param {EntityScript} entity
   */
  insert(entity) {
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

  /**
   * @param {EntityScript[]} entityList
   */
  insertAll(entityList = []) {
    entityList.forEach((entity) => { this.insert(entity); });
  }

  /**
   * @param {EntityScript} entityToCheckCollision
   * @return {EntityScript[]}
   */
  retrieve(entityToCheckCollision) {
    let returnObjects = [];
    const index = this.getIndex(entityToCheckCollision);

    if (index >= 0 && this.nodes[0]) {
      returnObjects = returnObjects.concat(this.nodes[index].retrieve(entityToCheckCollision));
    }

    return returnObjects.concat(this.objectList);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    this.bounds.render(ctx);
    this.nodes.forEach((node) => { node.render(ctx); });
  }
}
