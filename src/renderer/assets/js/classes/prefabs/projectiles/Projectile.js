import PhysicEntityScript from '../PhysicEntityScript';
import Component from '../../components/Component';
import AttachedEntities from '../../components/AttachedEntities';
import Health from '../../components/Health';
import AbstractClassError from '../../errors/AbstractClassError';

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

    this.components.sprite.priority = Component.PRIORITY_HIGH;

    this.on('collide', (e) => {
      this.getAttacked(e.details.collider);
    });
  }
}
