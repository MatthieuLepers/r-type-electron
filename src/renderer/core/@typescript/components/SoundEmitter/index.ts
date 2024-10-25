import Component from '@renderer/core/@typescript/components/Component';
import Cooldown from '@renderer/core/@typescript/components/Cooldown';
import { CooldownMixin } from '@renderer/core/@typescript/components/Cooldown/mixin';
import EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type Sound from '@renderer/core/@typescript/ressources/Sound';

export default class SoundEmitter extends CooldownMixin(Component<EntityScript>) {
  public currentSound: Record<string, Sound> = {};

  constructor(inst: EntityScript, clazz: Function) {
    super(inst, clazz);
    this.currentSound = {};

    this.addComponent(Cooldown<EntityScript>, SoundEmitter);
  }
}
