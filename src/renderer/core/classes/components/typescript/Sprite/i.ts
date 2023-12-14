import type EventEmitter from '@renderer/core/classes/components/EventEmitter';
import type Sprite from '@/renderer/core/classes/components/typescript/Sprite';
import type Transform from '@renderer/core/classes/components/Transform';

export interface ISprite {
  components: {
    eventemitter: EventEmitter,
    sprite: Sprite,
    transform: Transform,
  };

  getId(): string;

  playAnimation(animName: string, loop: boolean): void;

  isVisible(): boolean;

  hide(): void;

  show(): void;
}
