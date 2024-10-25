import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Module, { Side } from '@renderer/core/@typescript/prefabs/Module';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class BlueLaser extends Projectile {
  declare shooter: PhysicEntityScript & IAttachedEntities;

  constructor(
    shooter: PhysicEntityScript & IAttachedEntities,
    target: PhysicEntityScript,
    public angle: number = 0,
  ) {
    super(shooter, target);
    this.addTag('player', 'laser', 'staySpawned');
    this.angle = angle;
    this.damages = 2;

    // Locomotor
    this.components.locomotor.speedX = 500;
    this.bindPath(this.getPath());
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_laser_${this.angle}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/blue_laser'),
      animation: `launch_t${this.getModuleTier()}`,
      rotation: this.angle + (this.getModuleSide() === Side.BACK && this.angle !== 0 ? 90 : 0),
      animationDelay: 1,
    });

    // Health
    this.components.health.setMaxHealth(2);

    // Physics
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => {
      this.playAnimation(`absorb_t${this.getModuleTier()}`);
      this.on('animOver', () => Explosion.EXPLOSION_BLUE_LASER(this).spawn());
    });
  }

  getModuleTier(): number {
    return this.shooter.getAttachedEntity<Module>('module').tier;
  }

  getModuleSide(): string {
    return this.shooter.getAttachedEntity<Module>('module').side;
  }

  getPath(): ComplexePath {
    const pathMX = (this.getModuleSide() === Side.FRONT ? '0' : '200');
    const pathMY = (this.angle < 0 ? '200' : '0');
    const pathLX = (this.getModuleSide() === Side.BACK ? '0' : '200');
    const pathLY = (this.angle > 0 ? '200' : '0');

    return ComplexePath.fromSvgString(`M ${pathMX} ${pathMY} L ${pathLX} ${pathLY}`).moveTo(new Point(
      this.shooter.components.transform.position.x + (this.getModuleSide() === Side.FRONT ? this.shooter.components.sprite.width : -this.shooter.getAttachedEntity<Module>('module').components.sprite.width),
      this.shooter.components.sprite.centerOrigin.y - 1.5,
    ));
  }
}
