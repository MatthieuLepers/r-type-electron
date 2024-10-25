import type Hitbox from '@renderer/core/@typescript/hitboxes/Hitbox';

export default class HitboxCollection {
  public hitboxList: Array<Hitbox> = [];

  public collidingHitboxList: Array<Hitbox> = [];

  constructor(...hitboxList: Array<Hitbox>) {
    this.hitboxList = hitboxList;
  }

  isColliding(hitboxCollection: HitboxCollection): boolean {
    return this.processCollision(hitboxCollection).length > 0;
  }

  isCollidingHull(): boolean {
    const [hitHull] = this.collidingHitboxList
      .filter((hitbox) => hitbox.isHull() || hitbox.collidingWith.map((hb) => hb.isHull()).includes(true))
    ;
    return !!hitHull;
  }

  isCollidingWeak(): boolean {
    const [hitWeak] = this.collidingHitboxList
      .filter((hitbox) => hitbox.isWeak() || hitbox.collidingWith.map((hb) => hb.isWeak()).includes(true))
    ;
    return !!hitWeak;
  }

  processCollision(hitboxCollection: HitboxCollection): Array<Hitbox> {
    if (!this.collidingHitboxList.length) {
      this.collidingHitboxList = this.hitboxList
        .reduce((acc, instHitbox) => [
          ...acc,
          ...hitboxCollection.hitboxList.filter((entityHitbox) => instHitbox.isColliding(entityHitbox)),
        ], [] as Array<Hitbox>)
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
