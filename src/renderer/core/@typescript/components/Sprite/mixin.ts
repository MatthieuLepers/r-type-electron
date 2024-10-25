import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@/renderer/core/@types/Mixin';
import { mix } from '@renderer/core/@types/Mixable';

import Sprite from '@renderer/core/@typescript/components/Sprite';
import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import { EventEmitterMixin } from '@renderer/core/@typescript/components/EventEmitter/mixin';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const SpriteMixin = <T extends AnyConstructor<EntityScript>>(base : T) => class MySpriteMixin extends mix(base).with(EventEmitterMixin) implements ISprite {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Sprite, MySpriteMixin);
  }

  getId(): string {
    return this.components.sprite.id;
  }

  playAnimation(animName: string, loop = false) {
    this.components.sprite.options.animation = animName;
    this.components.sprite.options.loop = loop;
    this.components.sprite.$currentFrameIndex = 0;
    this.components.sprite.$currentTick = 0;
    if (this.hasComponent('EventEmitter')) {
      this.emit('animStart', { anim: animName });
    }
  }

  isVisible(): boolean {
    return this.components.transform.position.x > -this.components.sprite.width
      && this.components.transform.position.x < Global.Game.canvas.width + this.components.sprite.width
      && this.components.transform.position.y > -this.components.sprite.height
      && this.components.transform.position.y < Global.Game.canvas.height + this.components.sprite.height
    ;
  }

  hide() {
    this.components.sprite.visible = false;
  }

  show() {
    this.components.sprite.visible = true;
  }
};
