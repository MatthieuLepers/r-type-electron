import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';
import Cooldown from '@renderer/core/classes/components/Cooldown';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Shooter extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.projectile = null;
    this.initProjectileFn = null;
    this.shootProbalility = 0.02;
    this.automatic = true;
    this.shootFn = null;
    this.shooter = null;

    this.$target = null;
    this.$lookAtTarget = false;
    this.requireTarget = false;
    this.retargetFn = null;

    this.useSpread = false;
    this.spread = {
      minAngle: 0,
      maxAngle: 0,
      stepAngle: 0,
      currentAngle: 0,
    };

    this.addComponent(Cooldown, Shooter);
    this.components.cooldown.time = 300;

    AddClassMethod(this.clazz, 'shoot', function () {
      const spriteCond = (this.hasComponent('Sprite') && this.isVisible()) || !this.hasComponent('Sprite');
      const chargedshooterCond = (this.hasComponent('ChargedShooter') && !this.components.chargedshooter.isCharging) || !this.hasComponent('ChargedShooter');

      if (!this.components.shooter.cooldownActive() && !this.hasTag('isDead') && chargedshooterCond && spriteCond) {
        if (typeof this.components.shooter.shootFn === 'function') {
          this.components.shooter.shootFn(this.components.shooter.target ?? null);
          this.components.shooter.startCooldown();
          return;
        }

        const projectile = this.components.shooter.projectile.new(this.components.shooter.shooter ?? this, this.components.shooter.target ?? null);
        if (this.components.shooter.useSpread) {
          projectile.components.sprite.options.rotation = this.components.shooter.spread.currentAngle;
          projectile.components.locomotor.path.rotate(this.components.shooter.spread.currentAngle, projectile.components.locomotor.path.startPoint);
          this.components.shooter.updateSpread();
        }
        if (typeof this.components.shooter.initProjectileFn === 'function') {
          this.components.shooter.initProjectileFn(projectile, this.components.shooter.target ?? null);
        }
        if (this.hasComponent('EventEmitter')) {
          this.emit('shoot', { projectile });
        }
        projectile.spawn();

        this.components.shooter.startCooldown();
      }
    });
  }

  /**
   * @param {Projectile} projectile
   */
  setProjectile(projectile) {
    this.projectile = projectile;
  }

  /**
   * @param {Number} minAngle
   * @param {Number} maxAngle
   * @param {Number} stepAngle
   * @param {Number} currentAngle
   */
  configureSpread(minAngle, maxAngle, stepAngle, currentAngle) {
    this.useSpread = true;
    this.spread.minAngle = minAngle;
    this.spread.maxAngle = maxAngle;
    this.spread.stepAngle = stepAngle;
    this.spread.currentAngle = currentAngle;
  }

  updateSpread() {
    if (this.spread.stepAngle > 0) { // Direction max
      if (this.spread.currentAngle + this.spread.stepAngle < this.spread.maxAngle) {
        this.spread.currentAngle += this.spread.stepAngle;
      } else {
        this.spread.stepAngle = -this.spread.stepAngle;
      }
    } else if (this.spread.currentAngle + this.spread.stepAngle > this.spread.minAngle) {
      this.spread.currentAngle += this.spread.stepAngle;
    } else {
      this.spread.stepAngle = -this.spread.stepAngle;
    }
  }

  /**
   * @return {EntityScript|null}
   */
  get target() {
    if ((!this.$target || (this.$target && this.$target.hasTag('isDead'))) && typeof this.retargetFn === 'function') {
      this.$target = this.retargetFn();
    }
    return this.$target ?? null;
  }

  /**
   * @param {EntityScript}
   */
  set target(target) {
    this.$target = target;
  }

  task() {
    if (this.automatic && Math.random() <= this.shootProbalility && ((this.requireTarget && this.target && !this.target.hasTag('isDead')) || !this.requireTarget) && (!this.inst.hasComponent('ChargedShooter') || (this.inst.hasComponent('ChargedShooter') && !this.inst.components.chargedshooter.isCharging))) {
      this.inst.shoot();
    }
  }
}
