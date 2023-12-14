import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/mixins/Mixable';
import { EventEmitterMixin } from '@/renderer/core/classes/components/typescript/EventEmitter/mixin';
import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type EventEmitter from '@renderer/core/classes/components/EventEmitter';
import type Sprite from '@/renderer/core/classes/components/typescript/Sprite';
import type { ISprite } from '@/renderer/core/classes/components/typescript/Sprite/i';
import type Transform from '@renderer/core/classes/components/Transform';

export const SpriteMixin = (superclass: Constructor<Class>) => class extends mix(superclass).with(EventEmitterMixin) implements ISprite {
  declare components: {
    eventemitter: EventEmitter,
    sprite: Sprite,
    transform: Transform,
  };

  getId(): number {
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
