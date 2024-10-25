import { mix } from '@renderer/core/@types/Mixable';

import Component from '@renderer/core/@typescript/components/Component';
import { CooldownMixin } from '@renderer/core/@typescript/components/Cooldown/mixin';
import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Rocket from '@renderer/core/@typescript/prefabs/projectiles/Rocket';

export default class RocketLauncher extends mix(Component<PhysicEntityScript & IAttachedEntities>).with(CooldownMixin) {
  constructor(inst: PhysicEntityScript & IAttachedEntities, clazz: Function) {
    super(inst, clazz);

    this.setCooldown(2000);
  }

  task() {
    if (!this.cooldownActive() && !this.inst.hasTag('dead')) {
      new Rocket(this.inst, 'top').spawn();
      new Rocket(this.inst, 'bottom').spawn();
      this.startCooldown();
    }
  }
}
