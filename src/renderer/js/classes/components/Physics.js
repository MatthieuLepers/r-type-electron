import { AddClassMethod } from '../../Utils';
import HitboxCollection from '../hitboxes/HitboxCollection';
import Component from './Component';

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
    this.collideTagsExcluded = [];
    this.collideFn = null;

    /**
     * @param {String} tag
     * @return {this}
     */
    AddClassMethod(this.clazz, 'addCollisionTag', function (...tags) {
      tags.forEach((tag) => {
        if (tag.startsWith('!')) {
          this.components.physics.collideTagsExcluded.push(tag.substr(1));
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
          this.components.physics.collideTagsExcluded.splice(this.components.physics.collideTagsExcluded.indexOf(tag.substr(1)), 1);
        } else {
          this.components.physics.collideTags.splice(this.components.physics.collideTags.indexOf(tag), 1);
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
    if (!entity || entity.hasTag('dead')) {
      return;
    }

    if (typeof this.collideFn === 'function' && this.collideFn(entity)) {
      this.checkCollision(entity);
      return;
    }

    const checkTags = this.collideTags.map(tag => entity.hasTag(tag)).reduce((acc, val) => acc && val, true);
    const checkExcludeTags = this.collideTagsExcluded.map(tag => !entity.hasTag(tag)).reduce((acc, val) => acc && val, true);

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
    if (entity.getId() !== this.inst.getId() && !this.inst.hasTag('invincible') && !entity.hasTag('invincible') && instHitbox.isColliding(entityHitbox)) {
      if (entity.hasComponent('EventEmitter')) {
        entity.emit('collide', { collider: this.inst, collisionData: entityHitbox });
      }
      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit('collide', { collider: entity, collisionData: instHitbox });
      }
    }
  }
}
