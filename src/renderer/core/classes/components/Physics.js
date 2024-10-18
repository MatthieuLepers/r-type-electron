import { AddClassMethod } from '@renderer/core/utils';
import HitboxCollection from '@renderer/core/classes/hitboxes/HitboxCollection';
import Component from '@renderer/core/classes/components/Component';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Physics extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);

    this.gravity = 1;
    this.collideTags = [];
    this.collideTagsExcluded = ['invincible'];
    this.collideFn = null;

    /**
     * @param {String} tag
     * @return {this}
     */
    AddClassMethod(this.clazz, 'addCollisionTag', function (...tags) {
      tags.forEach((tag) => {
        if (tag.startsWith('!')) {
          this.components.physics.collideTagsExcluded.push(tag.substring(1));
        } else {
          this.components.physics.collideTags.push(tag);
        }
      });
      return this;
    });

    /**
     * @param {String} tags
     * @return {this}
     */
    AddClassMethod(this.clazz, 'removeCollisionTag', function (...tags) {
      tags.forEach((tag) => {
        if (tag.startsWith('!')) {
          this.components.physics.collideTagsExcluded = this.components.physics.collideTagsExcluded.filter((t) => t !== tag.substring(1));
        } else {
          this.components.physics.collideTags = this.components.physics.collideTags.filter((t) => t !== tag);
        }
      });
      return this;
    });
  }

  /**
   * @param {Number} gravity
   * @return {this}
   */
  setGravity(gravity) {
    this.gravity = gravity;
    return this;
  }

  /**
   * @param {EntityScript} entity
   */
  checkCollidingWith(entity) {
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

  /**
   * @param {EntityScript} entity
   */
  checkCollision(entity) {
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

  toDebugObject() {
    return {
      gravity: this.gravity,
      collideTags: this.collideTags,
      collideTagsExcluded: this.collideTagsExcluded,
    };
  }
}
