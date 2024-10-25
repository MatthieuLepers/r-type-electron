import Global from '@renderer/core/stores/AppStore';

import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';
import type Asset from '@renderer/core/@typescript/ressources/Asset';

export interface IChargedBulletData {
  health: number;
  speed: number;
  damages: number;
}

export default class ShipChargedBullet extends Projectile {
  public data: IChargedBulletData;

  public asset: Asset;

  constructor(
    shooter: PhysicEntityScript,
    target: PhysicEntityScript,
    percent: number,
  ) {
    super(shooter, target);
    this.addTag('player', 'piercing');
    this.data = this.getData(percent);
    this.asset = Global.Assets.get(`entities/projectiles/chargedbullet_${ShipChargedBullet.parsePercent(percent)}`);
    this.damages = this.data.damages;

    // Locomotor
    this.components.locomotor.speedX = this.data.speed;
    this.bindPath(ComplexePath.fromSvgString('M 300 300 L 500 300').moveTo(new Point(
      this.shooter.components.transform.position.x + this.shooter.components.sprite.width + 5,
      this.shooter.components.sprite.centerOrigin.y - (this.asset.height / 2),
    )));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_chargedbullet${Global.Game.uniqid()}`,
      asset: this.asset,
      animation: 'loop',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(this.data.health);

    // Physics
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => this.despawn());
  }

  static parsePercent(percent: number): number {
    return (percent >= 15 && percent < 25 && 15)
      || (percent >= 25 && percent < 50 && 25)
      || (percent >= 50 && percent < 75 && 50)
      || (percent >= 75 && percent < 90 && 75)
      || (percent >= 90 && percent <= 100 && 90)
      || 0
    ;
  }

  getData(percent: number): IChargedBulletData {
    const data = {
      15: { health: 8, speed: 600, damages: 8 },
      25: { health: 8.5, speed: 700, damages: 8.5 },
      50: { health: 9, speed: 800, damages: 9 },
      75: { health: 9.5, speed: 900, damages: 9.5 },
      90: { health: 10, speed: 1000, damages: 10 },
    };
    return data[ShipChargedBullet.parsePercent(percent)];
  }
}
