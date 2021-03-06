import Global from '../../stores/AppStore';
import PhysicEntityScript from './PhysicEntityScript';
import Shooter from '../components/Shooter';
import RectangleHitbox from '../hitboxes/RectangleHitbox';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class BitModule extends PhysicEntityScript {
  /**
   * @constructor
   * @param {EntityScript} owner
   * @param {String} slot
   */
  constructor(owner, slot) {
    super();
    this.addTag('module', 'bitModule', 'player', 'weapon', 'alwaysVisible', 'staySpawned');
    this.slot = slot;
    this.owner = owner;
    this.owner.attachEntity(this, `bitmodule_${this.slot}`);
    this.damages = 1;

    this.addComponent(Shooter, BitModule);

    // Transform
    this.setTransform(
      this.owner.components.transform.position.x + 7.5,
      this.owner.components.transform.position.y + (this.slot === BitModule.SLOT_TOP ? -36 : 36),
    );

    // Locomotor
    this.components.locomotor.speedX = owner.components.locomotor.speedX;
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.owner.getId()}_bitmodule_${this.slot}`,
      asset: Global.Assets.get('entities/module/bit_module'),
      animation: (this.slot === BitModule.SLOT_TOP ? 'loop' : 'loop_reverse'),
      loop: true,
    });

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('enemy', '!projectile', '!isDead');

    // Shooter
    this.components.shooter.shootFn = () => {
      const module = this.owner.getAttachedEntity('module') || null;
      if (module && module.tier >= 1 && module.gun && module.gun.type === 'DNA') {
        module.gun.secondaryShoot(module);
      }
    };
    this.components.shooter.automatic = false;
    this.components.shooter.setCooldown(90);

    this.on('detached', () => {
      // Prevent cycle dependency
      import('./items/BitModuleUpgrade')
        .then((module) => {
          this.despawn();
          module.default.new(this).spawn();
        })
      ;
    });
  }

  /**
   * @return {String}
   */
  static get SLOT_TOP() {
    return 'top';
  }

  /**
   * @return {String}
   */
  static get SLOT_BOTTOM() {
    return 'bottom';
  }
}
