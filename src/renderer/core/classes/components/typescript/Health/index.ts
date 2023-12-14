import Global from '@renderer/core/stores/AppStore';
import { mix } from '@/renderer/core/mixins/Mixable';
import DrawableComponent from '@renderer/core/classes/components/DrawableComponent';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import { CooldownMixin } from '@/renderer/core/classes/components/typescript/Cooldown/mixin';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export default class Health extends mix(DrawableComponent).with(CooldownMixin) {
  declare components: {
    cooldown: Cooldown,
  };

  declare inst: TEntityScript;

  public damages: number | null = null;

  public healthBarVisible: boolean = false;

  #maxHealth: number = 0;

  #health: number = 0;

  #absorbsion: number = 0;

  #invincible: boolean = false;

  constructor(inst: TEntityScript, clazz: Function) {
    super(inst, clazz);

    this.addComponent(Cooldown, Health);
    this.components.cooldown.time = 90;
  }

  setMaxHealth(maxHealth: number) {
    this.#maxHealth = Math.abs(maxHealth);
    this.#health = this.#maxHealth;
  }

  setHealth(health: number) {
    this.#health = Math.min(Math.abs(health), this.#maxHealth);
  }

  setInvincible(invincible = true) {
    this.#invincible = invincible;
    this.inst[invincible ? 'removeTag' : 'addTag']('invincible');
  }

  addAbsorbsion(absorbsion: number) {
    this.#absorbsion += Math.abs(absorbsion);
  }

  getPercent(): number {
    return this.#health / this.#maxHealth;
  }

  setPercent(percent: number) {
    this.setHealth(this.#maxHealth * percent);
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

  getAttacked(attacker: TEntityScript) {
    const damages = attacker.damages ?? Infinity;
    if (!this.inst.components.health.cooldownActive() && !this.inst.hasTag('invincible') && !this.inst.hasTag('isDead') && damages > 0) {
      this.inst.components.health.#absorbsion -= damages;
      if (this.inst.components.health.#absorbsion < 0) {
        this.inst.components.health.#health += this.inst.components.health.#absorbsion;
        this.inst.components.health.#absorbsion = 0;
      }

      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit('damaged', { damages, attacker });
      }

      if (this.inst.getTotalHealth() <= 0) {
        this.inst.addTag('isDead');
        if (this.inst.hasComponent('EventEmitter')) {
          this.inst.emit('dead', { killer: attacker });
        }
      }
      this.inst.components.health.startCooldown();
    }
  }

  getTotalHealth() {
    return this.inst.components.health.#health + this.inst.components.health.#absorbsion;
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
