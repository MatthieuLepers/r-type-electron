import Global from '@renderer/core/stores/AppStore';
import Projectile from '@renderer/core/classes/prefabs/projectiles/Projectile';
import Module from '@renderer/core/classes/prefabs/Module';
import Point from '@renderer/core/classes/geometry/Point';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class DnaBeam extends Projectile {
  /**
   * @constructor
   * @param {EntityScript} shooter
   */
  constructor(shooter) {
    super(shooter, null);
    this.addTag('player', 'dna', 'staySpawned');
    this.side = this.shooter.getAttachedEntity('module').side;
    this.$offset = 0;
    this.damages = 10;

    // Transform
    this.setTransform(
      this.shooter.components.transform.position.x + (this.side === Module.SIDE_FRONT ? this.shooter.components.sprite.width : -120),
      this.shooter.components.sprite.centerOrigin.y - 28,
    );

    // Locomotor
    this.components.locomotor.speedX = 0;
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.shooter.getId()}_dnabeam${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/projectiles/dna_beam_part1'),
      animation: `launch_${this.side}`,
      animationDelay: 0,
    });
    this.shooter.attachEntity(this); // Attach after setting sprite ID
    this.components.transform.calcPositionFn = () => { // Positionning when module is on back side
      if (this.side === Module.SIDE_BACK) {
        return new Point(
          this.components.transform.position.x - this.components.sprite.frame.width + this.components.sprite.getMaxFrameWidth(),
          this.components.transform.position.y,
        );
      }
      return this.components.transform.position.clone();
    };

    // Health
    this.components.health.setMaxHealth(5);

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.components.physics.initHitboxFn = (hitbox) => {
      if (this.$offset > 0) {
        hitbox.bounds = {
          x: this.components.transform.position.x - (this.side === Module.SIDE_BACK ? this.components.sprite.width + this.components.sprite.getMaxFrameWidth() - 208 : 0) + this.components.sprite.frame.data.hitboxOffsetX,
          y: this.components.transform.position.y,
          width: this.components.sprite.width - this.components.sprite.frame.data.hitboxOffsetX,
          height: this.components.sprite.height,
        };
      } else {
        hitbox.bounds = {
          x: this.components.transform.position.x - (this.side === Module.SIDE_BACK ? this.components.sprite.width + this.components.sprite.getMaxFrameWidth() - 240 : 0),
          y: this.components.transform.position.y,
          width: this.components.sprite.width,
          height: this.components.sprite.height,
        };
      }
    };
    this.addCollisionTag('enemy', '!projectile');

    this.on('animOver', () => this.beamLoop());
    this.on('outOfScreen', () => {
      this.shooter.detachEntity(this);
      this.despawn();
    });
    this.shooter.on('shootEnd', this.onEntityDetached.bind(this));
    this.shooter.on('chargeStart', this.onEntityDetached.bind(this));
    this.shooter.module.on('detached', this.onEntityDetached.bind(this));
  }

  beamLoop() {
    const sign = (this.side === Module.SIDE_FRONT ? 1 : -1);
    // Locomotor
    if (this.hasTag('attached')) {
      this.setTransform(
        this.shooter.components.transform.position.x + (sign > 0 ? this.shooter.components.sprite.width : -120) + sign * (this.$offset === 0 ? 64 : ((this.$offset + 1) * 64)),
        this.shooter.components.sprite.centerOrigin.y - 16,
      );
    } else {
      this.components.transform.position.add(sign * 64, 0);
    }

    // Sprite
    this.components.sprite.init({
      asset: Global.Assets.get('entities/projectiles/dna_beam_part2'),
      animationDelay: 0,
    });
    if (this.$offset === 0) {
      this.components.sprite.init({
        animation: `launch_${this.side}`,
      });
    }

    this.$offset += 1;
  }

  detachBeam() {
    this.shooter.detachEntity(this);
    // Transform
    // this.setTransform(this.components.transform.position.x, this.components.transform.position.y);
    this.components.transform.position = this.components.transform.$position.clone();
  }

  onEntityDetached() {
    if (this.$offset > 0) {
      this.detachBeam();
    } else {
      this.on('animOver', () => this.detachBeam(), { once: true });
    }
  }
}
