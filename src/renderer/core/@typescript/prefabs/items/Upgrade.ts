import type { IEvent } from '@renderer/core/@typescript/Event';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import Item from '@renderer/core/@typescript/prefabs/items/Item';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default abstract class Upgrade extends Item {
  constructor(dropper: PhysicEntityScript) {
    super(dropper);
    this.score = 100;

    // Physics
    this.addCollisionTag('player', '!module', '!projectile');
    this.removeCollisionTag('!invinsible');

    // Locomotor
    this.components.locomotor.speedX = 75;
    this.bindPath(ComplexePath.fromSvgString('M 100 0 L 0 0').moveTo(new Point(this.dropper.components.sprite.centerOrigin.x - 10, this.dropper.components.sprite.centerOrigin.y - 9)));
    this.components.locomotor.canMove = true;

    this.on('picked', (e: IEvent) => {
      this.onPicked(e.details.picker);

      if (e.details.picker.hasTag('player') && e.details.picker.hasComponent('ScoreBoard')) {
        e.details.picker.incrementScore(this);
        e.details.picker.incrementStat('picked', this);
      }
    });
  }

  abstract onPicked(picker: PlayerShip): void;
}
