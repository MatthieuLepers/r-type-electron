import PhysicEntityScript from '../PhysicEntityScript';
import AttachedEntities from '../../components/AttachedEntities';
import Health from '../../components/Health';
import AbstractClassError from '../../errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Enemy extends PhysicEntityScript {
  /**
   * @constructor
   */
  constructor() {
    super();
    if (this.constructor.name === 'Enemy') {
      throw new AbstractClassError(this);
    }
    this.spawnedFrom = null;

    this.addTag('enemy');

    this.addComponent(AttachedEntities, Enemy);
    this.addComponent(Health, Enemy);

    this.on('collide', function (e) {
      if (!e.details.collisionData.isCollidingHull()) {
        this.getAttacked(e.details.collider, e.details.collisionData);
      }
    });
    this.on('dead', (e) => {
      console.log(`Killed by ${e.details.killer.getId()}`);
    });
  }

  despawn() {
    if (this.spawnedFrom) {
      this.spawnedFrom.despawn();
    }
    super.despawn();
  }
}
