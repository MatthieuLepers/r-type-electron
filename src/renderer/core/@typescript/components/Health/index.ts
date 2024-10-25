import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import DrawableComponent from '@renderer/core/@typescript/components/DrawableComponent';
import { CooldownMixin } from '@renderer/core/@typescript/components/Cooldown/mixin';
import type { IHealth } from '@renderer/core/@typescript/components/Health/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export default class Health extends mix(DrawableComponent<EntityScript & IHealth>).with(CooldownMixin) {
  public damages: number | null = null;

  public healthBarVisible: boolean = false;

  protected $maxHealth: number = 0;

  protected $health: number = 0;

  protected $absorbsion: number = 0;

  protected $shield: number = 0;

  protected $invincible: boolean = false;

  constructor(inst: EntityScript & IHealth, clazz: Function) {
    super(inst, clazz);

    this.components.cooldown.time = 90;
  }

  setMaxHealth(maxHealth: number) {
    this.$maxHealth = Math.abs(maxHealth);
    this.$health = this.$maxHealth;
  }

  setHealth(health: number) {
    this.$health = Math.min(Math.abs(health), this.$maxHealth);
  }

  setInvincible(invincible = true) {
    this.$invincible = invincible;
    this.inst[invincible ? 'removeTag' : 'addTag']('invincible');
  }

  addAbsorbsion(absorbsion: number, attacker?: EntityScript) {
    this.$absorbsion += absorbsion;
    this.inst.emit('absorbsionConsumed', { absorbsion: Math.max(0, this.$absorbsion) });
    if (this.$absorbsion < 0) {
      this.$health += this.$absorbsion;
      this.$absorbsion = 0;

      this.inst.emit('damaged', {
        damages: attacker?.damages ?? Infinity,
        attacker,
      });

      if (this.$health <= 0) {
        this.inst.addTag('isDead');
        this.inst.emit('dead', { killer: attacker });
      }
    }
  }

  addShield(shield: number) {
    this.$shield += shield;
    this.inst.emit(this.$shield > 0 ? 'shieldHit' : 'shieldBroke', { shield: Math.max(0, this.$shield) });
    if (this.$shield < 0) {
      this.$shield = 0;
    }
  }

  getPercent(): number {
    return this.$health / this.$maxHealth;
  }

  setPercent(percent: number) {
    this.setHealth(this.$maxHealth * percent);
  }

  getHealthBarColor(): '#0f0' | '#f70' | '#f00' {
    if (this.getPercent() >= 0.5) {
      return '#0f0';
    }
    if (this.getPercent() >= 0.25 && this.getPercent() < 0.5) {
      return '#f70';
    }
    return '#f00';
  }

  getAttacked(attacker: EntityScript) {
    const damages = attacker.damages ?? Infinity;
    if (!this.cooldownActive() && !this.inst.hasTag('invincible') && !this.inst.hasTag('isDead') && damages > 0) {
      if (this.$shield > 0) {
        this.addShield(-damages);
      } else {
        this.addAbsorbsion(-damages, attacker);
      }
      this.startCooldown();
    }
  }

  getTotalHealth() {
    return this.$health + this.$absorbsion;
  }

  toDebugObject() {
    return {
      damages: this.damages,
      maxHealth: this.$maxHealth,
      health: this.$health,
      absorbsion: this.$absorbsion,
      invincible: this.$invincible,
    };
  }

  render() {
    if (Global.Settings.debug.drawHealthBars && this.healthBarVisible && this.inst.hasComponent('Sprite')) {
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
