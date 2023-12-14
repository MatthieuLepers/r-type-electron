import Component from '@renderer/core/classes/components/Component';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import Rocket from '@renderer/core/classes/prefabs/projectiles/Rocket';
import { mix, Ctor } from '@renderer/core/mixins/Mixable';
import { CooldownMixin } from '@/renderer/core/classes/components/typescript/Cooldown/mixin';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export default class RocketLauncher extends mix(Component as Ctor<Component>).with(CooldownMixin) {
  declare inst: TEntityScript;

  constructor(inst: TEntityScript, clazz: Function) {
    super(inst, clazz);

    this.addComponent(Cooldown, RocketLauncher);
    this.setCooldown(2000);
  }

  task() {
    if (!this.cooldownActive() && !this.inst.hasTag('dead')) {
      Rocket.new(this.inst, 'top').spawn();
      Rocket.new(this.inst, 'bottom').spawn();
      this.startCooldown();
    }
  }
}
