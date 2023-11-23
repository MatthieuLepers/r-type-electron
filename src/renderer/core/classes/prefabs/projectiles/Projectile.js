import PhysicEntityScript from '@renderer/core/classes/prefabs/PhysicEntityScript';
import { ComponentPriorityEnum } from '@renderer/core/classes/components/Component';
import AttachedEntities from '@renderer/core/classes/components/AttachedEntities';
import Health from '@renderer/core/classes/components/Health';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Projectile extends PhysicEntityScript {
  /**
   * @constructor
   * @param {EntityScript} shooter
   * @param {EntityScript} target
   */
  constructor(shooter, target = null) {
    super();
    if (this.constructor.name === 'Projectile') {
      throw new AbstractClassError(this);
    }
    this.shooter = shooter;
    this.target = target;
    this.addTag('projectile');

    this.addComponent(AttachedEntities, Projectile);
    this.addComponent(Health, Projectile);

    // Sprite
    this.components.sprite.priority = ComponentPriorityEnum.HIGH;

    this.on('collide', (e) => {
      this.getAttacked(e.details.collider);
    });
  }
}
