import Component from '@renderer/core/classes/components/Component';
import { mix } from '@/renderer/core/mixins/Mixable';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import { CooldownMixin } from '@/renderer/core/classes/components/typescript/Cooldown/mixin';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type Sound from '@renderer/core/classes/ressources/Sound';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class SoundEmitter extends mix(Component).with(CooldownMixin) {
  public currentSound: Record<string, Sound> = {};

  constructor(inst: EntityScript, clazz: Function) {
    super(inst, clazz);
    this.currentSound = {};

    this.addComponent(Cooldown, SoundEmitter);
  }
}
