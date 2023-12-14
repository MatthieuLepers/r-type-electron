import HitboxCollection from '@renderer/core/classes/hitboxes/HitboxCollection';
import Component from '@renderer/core/classes/components/Component';
import type { TPhysicEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export default class Physics extends Component {
  declare inst: TPhysicEntityScript;

  public gravity: number = 1;

  public collideTags: Array<string> = [];

  public collideTagsExcluded: Array<string> = ['invincible'];

  public collideFn: ((entity: TPhysicEntityScript) => boolean) | null = null;

  setGravity(gravity: number) {
    this.gravity = gravity;
  }

  checkCollidingWith(entity: TPhysicEntityScript) {
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

  checkCollision(entity: TPhysicEntityScript) {
    const instHitbox = new HitboxCollection(...this.inst.getHitbox());
    const entityHitbox = new HitboxCollection(...entity.getHitbox());
    if (entity.getId() !== this.inst.getId() && instHitbox.isColliding(entityHitbox)) {
      if (entity.hasComponent('EventEmitter')) {
        entity.emit('collide', { collider: this.inst, collisionData: entityHitbox });
      }
      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit('collide', { collider: entity, collisionData: instHitbox });
      }
    }
  }
}
