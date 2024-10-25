import { mix } from '@renderer/core/@types/Mixable';

import Class from '@renderer/core/@typescript/Class';
import { CooldownMixin } from '@renderer/core/@typescript/components/Cooldown/mixin';
import Module, { Side } from '@renderer/core/@typescript/prefabs/Module';

export default abstract class Weapon extends mix(Class).with(CooldownMixin) {
  public type: string;

  constructor(type: string) {
    super();
    this.type = type.toUpperCase();
  }

  shoot(module: Module) {
    this.primaryShoot(module);
  }

  primaryShoot(module: Module) {
    if (module && (module.side === Side.FRONT || module.side === Side.BACK)) {
      if (module.tier === 1) {
        this.shootTier1(module);
      } else {
        this.shootTier2(module);
      }
    }
  }

  abstract secondaryShoot(module: Module): void;

  abstract shootTier1(module: Module): void;

  abstract shootTier2(module: Module): void;
}
