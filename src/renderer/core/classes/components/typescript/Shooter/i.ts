import type ChargedShooter from '@renderer/core/classes/components/ChargedShooter';
import type EventEmitter from '@renderer/core/classes/components/EventEmitter';
import type Sprite from '@renderer/core/classes/components/Sprite';
import type Shooter from '@/renderer/core/classes/components/typescript/Shooter';
import type Transform from '@renderer/core/classes/components/Transform';

export interface IShooter {
  components: {
    shooter: Shooter,
    chargedshooter: ChargedShooter,
    eventemitter: EventEmitter,
    sprite: Sprite,
    transform: Transform,
  };

  shoot(): void;
}
