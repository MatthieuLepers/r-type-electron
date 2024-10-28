import Component from '@renderer/core/@typescript/components/Component';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import HitboxCollection from '@renderer/core/@typescript/hitboxes/HitboxCollection';

export default class Physics extends Component<PhysicEntityScript> {
  public gravity: number = 1;

  public collideTags: Array<string> = [];

  public collideTagsExcluded: Array<string> = ['invincible'];

  public collideFn: ((entity: PhysicEntityScript) => boolean) | null = null;

  setGravity(gravity: number) {
    this.gravity = gravity;
  }

  checkCollidingWith(entity: PhysicEntityScript) {
    if (!entity || entity.hasTag('isDead')) {
      return;
    }

    if (typeof this.collideFn === 'function' && this.collideFn(entity)) {
      this.checkCollision(entity);
      return;
    }

    const checkTags = this.collideTags
      .reduce((acc, tag) => acc && entity.hasTag(tag), true)
    ;
    const checkExcludeTags = this.collideTagsExcluded
      .reduce((acc, tag) => acc && !entity.hasTag(tag), true)
    ;

    if (checkTags && checkExcludeTags) {
      this.checkCollision(entity);
    }
  }

  checkCollision(entity: PhysicEntityScript) {
    const instHitbox = new HitboxCollection(...this.inst.getHitbox());
    const entityHitbox = new HitboxCollection(...entity.getHitbox());
    if (entity.getId() !== this.inst.getId() && instHitbox.isColliding(entityHitbox)) {
      entity.emit('collide', { collider: this.inst, collisionData: entityHitbox });
      this.inst.emit('collide', { collider: entity, collisionData: instHitbox });
    }
  }

  toDebugObject() {
    return {
      gravity: this.gravity,
      collideTags: this.collideTags,
      collideTagsExcluded: this.collideTagsExcluded,
    };
  }
}
