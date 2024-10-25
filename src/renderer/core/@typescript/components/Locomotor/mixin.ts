import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import Locomotor from '@renderer/core/@typescript/components/Locomotor';
import type { ILocomotor } from '@renderer/core/@typescript/components/Locomotor/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export const LocomotorMixin = <T extends AnyConstructor<EntityScript>>(base : T) => class MyLocomotorMixin extends base implements ILocomotor {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Locomotor, MyLocomotorMixin);
  }

  move() {
    if (!this.hasTag('isDead', 'debug') && !Global.Engine.paused && this.components.locomotor.canMove) {
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
