import { mix } from '@renderer/core/@types/Mixable';

import Component from '@renderer/core/@typescript/components/Component';
import { CooldownMixin } from '@renderer/core/@typescript/components/Cooldown/mixin';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import Rocket from '@renderer/core/@typescript/prefabs/projectiles/Rocket';

export default class RocketLauncher extends mix(Component<PlayerShip>).with(CooldownMixin) {
  public enabled: boolean = false;

  constructor(inst: PlayerShip, clazz: Function) {
    super(inst, clazz);

    this.setCooldown(2000);
  }

  task() {
    if (this.enabled && !this.cooldownActive() && !this.inst.hasTag('dead')) {
      new Rocket(this.inst, 'top').spawn();
      new Rocket(this.inst, 'bottom').spawn();
      this.inst.playSound('fx/player/rocket_launch');
      this.startCooldown();
    }
  }
}
