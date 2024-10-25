import Global from '@renderer/core/stores/AppStore';

import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import Module, { Side } from '@renderer/core/@typescript/prefabs/Module';
import Projectile from '@renderer/core/@typescript/prefabs/projectiles/Projectile';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export enum Color {
  RED = 'red',
  BLUE = 'blue',
}

export default class DnaBullet extends Projectile {
  declare shooter: PhysicEntityScript & IAttachedEntities;

  constructor(
    shooter: PhysicEntityScript & IAttachedEntities,
    target: PhysicEntityScript,
    public color: `${Color}`,
  ) {
    super(shooter, target);
    this.addTag('player', 'dna');
    this.damages = 3;

    // Locomotor
    this.components.locomotor.speedX = 800;
    this.bindPath(this.getPath());
    this.components.locomotor.canMove = true;
    // if (this.shooter.hasTag('module', 'bitModule')) {
    //   this.shooter = this.shooter.owner;
    // }

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_dnabullet_${this.color}${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/dna_bullet'),
      animation: `loop_${this.color}${(this.getModuleSide() === Side.FRONT ? '' : '_reverse')}`,
      loop: true,
      animationDelay: 6,
    });

    // Health
    this.components.health.setMaxHealth(3);

    // Physics
    this.addCollisionTag('enemy', '!projectile');

    this.on('dead', () => Explosion.EXPLOSION_DNA_BULLET(this).spawn());
  }

  getModuleSide(): string {
    let { shooter } = this;
    if (this.shooter.hasTag('module', 'bitModule')) {
      shooter = (this.shooter as unknown as Module).owner;
    }
    return shooter.getAttachedEntity<Module>('module').side;
  }

  getPath(): ComplexePath {
    const pathMX = (this.getModuleSide() === Side.FRONT ? '0' : '300');
    const pathLX = (this.getModuleSide() === Side.FRONT ? '300' : '0');

    // Shooter is a BitModule
    if (this.shooter.hasTag('module', 'bitModule')) {
      return ComplexePath.fromSvgString(`M ${pathMX} 0 L ${pathLX} 0`).moveTo(new Point(
        this.shooter.components.transform.position.x + (this.getModuleSide() === Side.FRONT ? 14 : -32),
        this.shooter.components.transform.position.y + (this.shooter.components.sprite.height / 2) - 2,
      ));
    }
    // Shooter is a Player
    return ComplexePath.fromSvgString(`M ${pathMX} 0 L ${pathLX} 0`).moveTo(new Point(
      this.shooter.components.transform.position.x + (this.getModuleSide() === Side.FRONT ? this.shooter.components.sprite.width + 5 : -this.shooter.components.sprite.width),
      this.shooter.components.transform.position.y + (this.color === Color.BLUE ? 16 : -1),
    ));
  }
}
