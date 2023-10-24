import Global from '@renderer/core/stores/AppStore';
import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ChargedShooter extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.projectile = null;
    this.initProjectileFn = null;
    this.shootProbability = 0.02;
    this.automatic = true;

    this.$target = null;
    this.requireTarget = false;
    this.retargetFn = null;

    this.chargeTime = 1500;
    this.isCharging = false;
    this.startTime = 0;

    AddClassMethod(this.clazz, 'chargeStart', function () {
      if (!this.hasTag('isDead') && !Global.Engine.paused && !this.components.chargedshooter.isCharging) {
        if (this.hasComponent('EventEmitter')) {
          this.emit('chargeStart');
        }
        this.components.chargedshooter.isCharging = true;
        this.components.chargedshooter.startTime = Date.now();
      }
    });

    AddClassMethod(this.clazz, 'chargeStop', function () {
      if (!this.hasTag('isDead') && !Global.Engine.paused && this.components.chargedshooter.isCharging) {
        const percent = Math.min(100, ((Date.now() - this.components.chargedshooter.startTime) * 100) / this.components.chargedshooter.chargeTime);

        if (this.hasComponent('EventEmitter')) {
          this.emit('chargeStop', { percent });
        }
        this.components.chargedshooter.isCharging = false;
        this.components.chargedshooter.startTime = 0;
        this.shootCharged(percent);
      }
    });

    /**
     * @param {Number}
     */
    AddClassMethod(this.clazz, 'shootCharged', function (percent) {
      const p = percent ?? 100;
      if (!this.hasTag('isDead') && !Global.Engine.paused && this.isVisible() && p >= 15) {
        const projectile = new this.components.chargedshooter.projectile(this, this.components.chargedshooter.target ?? null, p);
        if (typeof this.components.chargedshooter.initProjectileFn === 'function') {
          this.components.chargedshooter.initProjectileFn(projectile, this.components.shooter.target ?? null);
        }
        if (this.hasComponent('EventEmitter')) {
          this.emit('shootCharged', { projectile });
        }
        projectile.spawn();
      }
    });
  }

  /**
   * @return {EntityScript|null}
   */
  get target() {
    if ((!this.$target || (this.$target?.hasTag('isDead'))) && typeof this.retargetFn === 'function') {
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

  /**
   * @param {Projectile} projectile
   */
  setProjectile(projectile) {
    this.projectile = projectile;
  }

  /**
   * @param {Number} chargeTime
   */
  setChargeTime(chargeTime) {
    this.chargeTime = chargeTime;
  }

  task() {
    if (!this.inst.hasTag('isDead') && this.isCharging && this.inst.hasComponent('EventEmitter') && !Global.Engine.paused) {
      const percent = Math.min(100, ((Date.now() - this.startTime) * 100) / this.chargeTime);
      this.inst.emit('chargeProgress', { percent });
    }
    if (this.automatic && Math.random() <= this.shootProbalility && ((this.requireTarget && this.target && !this.target.hasTag('isDead')) || !this.requireTarget)) {
      this.inst.shootCharged();
    }
  }
}
