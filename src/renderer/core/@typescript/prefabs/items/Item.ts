import type { IEvent } from '@renderer/core/@typescript/Event';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';

export default abstract class Item extends PhysicEntityScript {
  constructor(public dropper: PhysicEntityScript = null) {
    super();
    this.addTag('item', 'pickable');

    // Physics
    this.addCollisionTag('!isDead');
    this.removeCollisionTag('!invincible');

    this.on('picked', () => {
      this.playSound('fx/player/pick_upgrade');
    });
    this.on('collide', this.pick.bind(this));
  }

  pick(e: IEvent) {
    this.emit('picked', { picker: e.details.collider });
    this.despawn();
  }
}
