import Global from '@renderer/core/stores/AppStore';
import type { Constructor } from '@renderer/core/@types';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type Locomotor from '@/renderer/core/classes/components/typescript/Locomotor';
import type { ILocomotor } from '@/renderer/core/classes/components/typescript/Locomotor/i';
import type Transform from '@renderer/core/classes/components/Transform';
import type Sprite from '@renderer/core/classes/components/Sprite';
import type ComplexePath from '@renderer/core/classes/paths/ComplexePath';

export const LocomotorMixin = (superclass: Constructor<EntityScript>) => class extends superclass implements ILocomotor {
  declare components: {
    locomotor: Locomotor,
    transform: Transform,
    sprite: Sprite,
  };

  move() {
    if (!this.hasTag('isDead', 'debug') && !Global.Game.paused && this.components.locomotor.canMove) {
      const nextPosition = this.components.locomotor.calcNextPosition();
      const delta = this.components.transform.position.delta(nextPosition);
      if (this.components.locomotor.followSlope && this.hasComponent('Sprite')) {
        const angle = this.components.locomotor.calcAngleAtPosition(nextPosition);
        this.components.sprite.options.rotation = angle;
      }

      if (this.hasComponent('Sprite')) {
        if (this.hasTag('alwaysVisible')) {
          if (nextPosition.x > 0 && nextPosition.x < (Global.Game.canvas.width - this.components.sprite.width)) {
            this.components.transform.add(delta.x, 0);
            if (this.hasComponent('EventEmitter')) {
              this.emit('move', { position: this.components.transform.position, speed: this.components.locomotor.speed });
            }
          }
          if (nextPosition.y > 0 && nextPosition.y < (Global.Game.canvas.height - this.components.sprite.height)) {
            this.components.transform.add(0, delta.y);
            if (this.hasComponent('EventEmitter')) {
              this.emit('move', { position: this.components.transform.position, speed: this.components.locomotor.speed });
            }
          }
        } else {
          this.components.transform.add(delta.x, delta.y);
          this.components.locomotor.setDirections();
          if (this.hasComponent('EventEmitter')) {
            this.emit('move', { position: this.components.transform.position, speed: this.components.locomotor.speed });
          }
        }
      } else {
        this.components.transform.add(delta.x, delta.y);
        this.components.locomotor.setDirections();
        if (this.hasComponent('EventEmitter')) {
          this.emit('move', { position: this.components.transform.position, speed: this.components.locomotor.speed });
        }
      }

      if (this.components.locomotor.$nextPathPercent) {
        this.components.locomotor.$pathPercent = this.components.locomotor.$nextPathPercent;
        this.components.locomotor.$nextPathPercent = null;
      }
    }
  }

  bindPath(path: ComplexePath, loop = true) {
    this.unBindPath();
    this.components.locomotor.path = path;
    this.components.locomotor.$pathLoop = loop;
    this.components.transform.position = path.startPoint!.clone();
  }

  unBindPath() {
    this.components.locomotor.path = null;
    this.components.locomotor.$pathLoop = true;
    this.components.locomotor.$pathPercent = 0.0;
    this.components.locomotor.$nextPathPercent = null;
  }
};
