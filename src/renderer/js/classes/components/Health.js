import Global from '../../stores/AppStore';
import { AddClassMethod } from '../../Utils';
import Component from './Component';
import Cooldown from './Cooldown';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Health extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.$maxHealth = 0;
    this.$health = 0;
    this.$absorbtion = 0;
    this.$invincible = false;
    this.healthBarVisible = false;

    this.addComponent(Cooldown, Health);
    this.components.cooldown.time = 90;

    /**
     * @param {Entity} attacker
     */
    AddClassMethod(this.clazz, 'getAttacked', function (attacker) {
      const damages = (attacker.damages ? attacker.damages : 99999);
      if (!this.components.health.cooldownActive() && !this.hasTag('invincible') && !this.hasTag('isDead') && damages > 0) {
        this.components.health.$absorbtion -= damages;
        if (this.components.health.$absorbtion < 0) {
          this.components.health.$health += this.components.health.$absorbtion;
          this.components.health.$absorbtion = 0;
        }

        if (this.hasComponent('EventEmitter')) {
          this.emit('damaged', { damages, attacker });
        }

        if (this.getTotalHealth() <= 0) {
          this.addTag('isDead');
          if (this.hasComponent('EventEmitter')) {
            this.emit('dead', { killer: attacker });
          }
        }
        this.components.health.startCooldown();
      }
    });

    /**
     * @return {Number}
     */
    AddClassMethod(this.clazz, 'getTotalHealth', function () {
      return this.components.health.$health + this.components.health.$absorbtion;
    });
  }

  /**
   * @param {Number} maxHealth
   */
  setMaxHealth(maxHealth) {
    this.$maxHealth = Math.abs(maxHealth);
    this.$health = this.$maxHealth;
  }

  /**
   * @param {Number} health
   */
  setHealth(health) {
    this.$health = (Math.abs(health) > this.maxHealth ? this.maxHealth : Math.abs(health));
  }

  /**
   * @param {Boolean} invincible
   */
  setInvincible(invincible = true) {
    this.$invincible = invincible;
    this.inst[this.$invincible ? 'removeTag' : 'addTag']('invincible');
  }

  /**
   * @param {Number} absorbtion
   */
  setAbsorbtion(absorbtion) {
    this.$absorbtion = Math.abs(absorbtion);
  }

  /**
   * @return {Number}
   */
  getPercent() {
    return this.$health / this.$maxHealth;
  }

  /**
   * @param {Float} percent - [0, 1]
   * @return {this}
   */
  setPercent(percent = 1.0) {
    this.$health = Math.floor(this.$maxHealth * percent);
    return this;
  }

  /**
   * @return {String}
   */
  getHealthBarColor() {
    if (this.getPercent() >= 0.5) {
      return '#0f0';
    }
    if (this.getPercent() >= 0.25 && this.getPercent() < 0.5) {
      return '#f70';
    }
    return '#f00';
  }

  task() {
    if (this.healthBarVisible && Global.Settings.debug.drawHealthBars && this.inst.hasComponent('Sprite')) {
      const { width } = this.inst.components.sprite;
      const { position } = this.inst.components.transform;
      if (position) {
        Global.Game.ctx.fillStyle = this.getHealthBarColor();
        Global.Game.ctx.fillRect(position.x + width / 2 - 25, position.y - 20, 50 * this.getPercent(), 5);
        Global.Game.ctx.strokeStyle = '#fff';
        Global.Game.ctx.strokeRect(position.x + width / 2 - 25, position.y - 20, 50, 5);
      }
    }
  }
}
