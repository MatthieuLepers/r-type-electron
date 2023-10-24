/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class HitboxCollection {
  /**
   * @constructor
   * @param {Hitbox[]} hitboxList
   */
  constructor(...hitboxList) {
    this.hitboxList = hitboxList;
    this.collidingHitboxList = [];
  }

  /**
   * @param {HitboxCollection} hitboxCollection
   * @return {Boolean}
   */
  isColliding(hitboxCollection) {
    return this.processCollision(hitboxCollection).length > 0;
  }

  /**
   * @return {Boolean}
   */
  isCollidingHull() {
    const [hitHull] = this.collidingHitboxList.filter((hitbox) => hitbox.isHull() || hitbox.collidingWith.map((hb) => hb.isHull()).indexOf(true) >= 0);

    return !!hitHull;
  }

  /**
   * @return {Boolean}
   */
  isCollidingWeak() {
    const [hitWeak] = this.collidingHitboxList.filter((hitbox) => hitbox.isWeak() || hitbox.collidingWith.map((hb) => hb.isWeak()).indexOf(true) >= 0);

    return !!hitWeak;
  }

  /**
   * @param {HitboxCollection} hitboxCollection
   * @return {Object[]}
   */
  processCollision(hitboxCollection) {
    if (!this.collidingHitboxList.length) {
      this.collidingHitboxList = this.hitboxList
        .reduce((acc, instHitbox) => acc.concat(hitboxCollection.hitboxList.filter((entityHitbox) => instHitbox.isColliding(entityHitbox))), [])
      ;
      hitboxCollection.hitboxList.forEach((hitbox) => {
        if (hitbox.colliding) {
          hitboxCollection.collidingHitboxList.push(hitbox);
        }
      });
    }
    return this.collidingHitboxList;
  }
}
