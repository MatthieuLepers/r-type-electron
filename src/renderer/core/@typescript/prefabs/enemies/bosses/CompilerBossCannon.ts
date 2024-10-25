import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import { LookerMixin } from '@renderer/core/@typescript/components/Looker/mixin';
import { ShooterMixin } from '@renderer/core/@typescript/components/Shooter/mixin';
import { AttachedEntitiesMixin } from '@renderer/core/@typescript/components/AttachedEntities/mixin';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import PlasmaBall from '@renderer/core/@typescript/prefabs/projectiles/PlasmaBall';
import type Enemy from '@renderer/core/@typescript/prefabs/enemies/Enemy';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class CompilerBossCannon extends mix(PhysicEntityScript)
  .with(AttachedEntitiesMixin)
  .with(LookerMixin)
  .with(ShooterMixin) {
  constructor(owner: Enemy, slot: string, deltaPos: Point) {
    super();

    this.addTag('boss', 'alwaysVisible', 'staySpawned');

    // Locomotor
    this.components.locomotor.canMove = true;

    // Transform
    this.setTransform(owner.components.transform.position.x + deltaPos.x, owner.components.transform.position.y + deltaPos.y);

    // Sprite
    this.components.sprite.init({
      id: `${owner.getId()}_cannon${slot}`,
      asset: Global.Assets.get('entities/null'),
      animation: 'idle',
    });

    // Shooter
    this.components.shooter.components.cooldown.time = 200;
    this.components.shooter.shootFn = this.shootFn.bind(this);
    this.components.shooter.shootProbalility = 0.05;
    this.components.shooter.requireTarget = true;
    this.components.shooter.target = this.getNearestPlayer();
    this.components.shooter.retargetFn = () => this.getNearestPlayer();

    // Looker
    this.components.looker.minAngle = 45;
    this.components.looker.maxAngle = 315;
    this.components.looker.sweepCheck = true;
    this.setLookAt(this.components.shooter.target);
  }

  shootFn(target: PhysicEntityScript) {
    const playerIsOnRight = target.components.transform.position.y - this.components.transform.position.y <= 0;
    if (playerIsOnRight) {
      // First plasma ball, targeting player on the left
      const projectileLeft = this.createPlasmaBall(target, `${this.getId()}_plasmaball0${Global.Game.uniqid()}`, 2 + Global.Random.rnd(1), 2 + Global.Random.rnd(1), false);
      projectileLeft.spawn();
      this.emit('shoot', { projectile: projectileLeft });

      // First plasma ball, targeting player on the left, reduced height
      const projectileLeft2 = this.createPlasmaBall(target, `${this.getId()}_plasmaball1${Global.Game.uniqid()}`, 1 + Global.Random.rnd(1), 1 + Global.Random.rnd(1), false);
      projectileLeft2.spawn();
      this.emit('shoot', { projectile: projectileLeft2 });

      // First plasma ball, targeting player on the right
      const projectileRight = this.createPlasmaBall(target, `${this.getId()}_plasmaball2${Global.Game.uniqid()}`, 2 + Global.Random.rnd(1), 2 + Global.Random.rnd(1), true);
      projectileRight.spawn();
      this.emit('shoot', { projectile: projectileLeft });

      // First plasma ball, targeting player on the right, reduced height
      const projectileRight2 = this.createPlasmaBall(target, `${this.getId()}_plasmaball3${Global.Game.uniqid()}`, 1 + Global.Random.rnd(1), 1 + Global.Random.rnd(1), true);
      projectileRight2.spawn();
      this.emit('shoot', { projectile: projectileLeft2 });
    }
  }

  createPlasmaBall(target: PhysicEntityScript, id: string, xMultiplier: number, yMultiplier: number, invert = false): PlasmaBall {
    const sign = invert ? -1 : 1;
    const projectile = new PlasmaBall(this, target);
    projectile.components.sprite.options.id = id;

    const p1 = new Point(this.components.transform.position.x, this.components.transform.position.y);
    const distanceXToTarget = p1.getHorizontaleDistanceTo(target.components.transform.position);
    const distanceYToTarget = p1.getVerticaleDistanceTo(target.components.transform.position);
    const p2 = new Point(this.components.transform.position.x - sign * distanceXToTarget * xMultiplier, Global.Game.canvas.height);

    const distanceXToP2 = p1.getHorizontaleDistanceTo(p2);
    const ctrlP1 = new Point(p1.x - sign * distanceXToP2 * 0.2, Math.min(0, p1.y - distanceYToTarget * yMultiplier));
    const ctrlP2 = new Point(p2.x + sign * distanceXToP2 * 0.3, p1.y);

    projectile.bindPath(ComplexePath.fromSvgString(`M ${p1.x} ${p1.y} C ${ctrlP1.x} ${ctrlP1.y} ${ctrlP2.x} ${ctrlP2.y} ${p2.x} ${p2.y}`));

    return projectile;
  }
}
