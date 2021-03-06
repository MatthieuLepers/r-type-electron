import Global from '../../../../stores/AppStore';
import EntityScript from '../../EntityScript';
import PlasmaBall from '../../projectiles/PlasmaBall';
import Point from '../../../geometry/Point';
import Locomotor from '../../../components/Locomotor';
import Looker from '../../../components/Looker';
import Shooter from '../../../components/Shooter';
import Sprite from '../../../components/Sprite';
import Transform from '../../../components/Transform';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class CompilerBossTurret extends EntityScript {
  /**
   * @param {EntityScript} parent
   * @param {String} slot
   * @param {Point} deltaPos
   * @constructor
   */
  constructor(parent, slot, deltaPos) {
    super();

    this.addTag('boss', 'alwaysVisible', 'staySpawned');
    this.addComponent(Locomotor, CompilerBossTurret);
    this.addComponent(Looker, CompilerBossTurret);
    this.addComponent(Shooter, CompilerBossTurret);
    this.addComponent(Sprite, CompilerBossTurret);
    this.addComponent(Transform, CompilerBossTurret);

    // Locomotor
    this.components.locomotor.canMove = true;

    // Transform
    this.setTransform(parent.components.transform.position.x + deltaPos.x, parent.components.transform.position.y + deltaPos.y);

    // Sprite
    this.components.sprite.init({
      id: `${parent.getId()}_turret${slot}`,
      asset: Global.Assets.get('entities/enemies/bosses/compiler_turret'),
      animation: 'idle',
      origin: new Point(19, 8),
    });

    // Shooter
    this.components.shooter.shootFn = this.shootFn.bind(this);
    this.components.shooter.shootProbalility = 0.05;
    this.components.shooter.requireTarget = true;
    this.components.shooter.target = this.getNearestPlayer();
    this.components.shooter.retargetFn = this.retargetFn.bind(this);

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
    if (this.isLookingAt(target)) {
      const projectile = PlasmaBall.new(this, target);
      projectile.spawn();
      this.emit('shoot', { projectile });
    }
  }

  /**
   * @return {EntityScript}
   */
  retargetFn() {
    const target = this.getNearestPlayer();
    this.setLookAt(target);
    return target;
  }
}
