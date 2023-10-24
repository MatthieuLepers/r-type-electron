import Global from '@renderer/core/stores/AppStore';
import EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import PlasmaBall from '@renderer/core/classes/prefabs/projectiles/PlasmaBall';
import Locomotor from '@renderer/core/classes/components/Locomotor';
import Looker from '@renderer/core/classes/components/Looker';
import Shooter from '@renderer/core/classes/components/Shooter';
import Sprite from '@renderer/core/classes/components/Sprite';
import Transform from '@renderer/core/classes/components/Transform';
import Point from '@renderer/core/classes/geometry/Point';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class CompilerBossCannon extends EntityScript {
  /**
   * @constructor
   * @param {EntityScript} owner
   * @param {String} slot
   * @param {Point} deltaPos
   */
  constructor(owner, slot, deltaPos) {
    super();

    this.addTag('boss', 'alwaysVisible', 'staySpawned');
    this.addComponent(Locomotor, CompilerBossCannon);
    this.addComponent(Looker, CompilerBossCannon);
    this.addComponent(Shooter, CompilerBossCannon);
    this.addComponent(Sprite, CompilerBossCannon);
    this.addComponent(Transform, CompilerBossCannon);

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

  /**
   * @param {EntityScript} target
   */
  shootFn(target) {
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

  /**
   * @param {EntityScript} target
   * @param {String} id
   * @param {Number} xMultiplier
   * @param {Number} yMultiplier
   * @param {Boolean} invert
   * @return {PlasmaBall}
   */
  createPlasmaBall(target, id, xMultiplier, yMultiplier, invert = false) {
    const sign = invert ? -1 : 1;
    const projectile = PlasmaBall.new(this, target);
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
