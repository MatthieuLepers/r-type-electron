import Global from '@renderer/core/stores/AppStore';

import { Priority } from '@renderer/core/@typescript/components/Component';
import DrawableComponent from '@renderer/core/@typescript/components/DrawableComponent';
import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import type { ILocomotor } from '@renderer/core/@typescript/components/Locomotor/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import { Direction } from '@renderer/core/@typescript/enums/Direction';
import Vector from '@renderer/core/@typescript/geometry/Vector';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class Locomotor extends DrawableComponent<PhysicEntityScript & IAttachedEntities & ISprite & ILocomotor> {
  public speed: Vector = new Vector(0, 0); // px/s => (1/60) px/frame

  public canMove: boolean = false;

  public path: ComplexePath | null = null;

  public followSlope: boolean = false;

  public trackedEntity: EntityScript | null = null;

  public retargetFn: (() => EntityScript | null) | null = null;

  public $currentDirection: Array<Direction> = [];

  public $pathLoop: boolean = true;

  public $pathPercent: number = 0.0;

  public $nextPathPercent: number | null = null;

  public $loopCount: number = 0;

  constructor(inst: PhysicEntityScript & IAttachedEntities & ISprite & ILocomotor, clazz: Function) {
    super(inst, clazz, Priority.LOW);
  }

  setDirections() {
    this.$currentDirection = [];
    if (this.speed.x > 0) {
      this.$currentDirection.push(Direction.RIGHT);
    } else if (this.speed.x < 0) {
      this.$currentDirection.push(Direction.LEFT);
    }
    if (this.speed.y > 0) {
      this.$currentDirection.push(Direction.DOWN);
    } else if (this.speed.y < 0) {
      this.$currentDirection.push(Direction.UP);
    }
  }

  calcNextPosition(): Point {
    if (this.path) {
      if (this.$pathPercent >= 1) {
        if (this.$pathLoop) {
          this.$pathPercent = 0.0;
          this.path = this.path.makeNextLoop();
          this.$loopCount += 1;
          this.inst.emit('pathLoop', { count: this.$loopCount });
        } else {
          this.$pathPercent = 1;
          this.inst.emit('pathEnd');
        }
      }
      const pathLength = this.path.getTotalLength() * (1 - this.$pathPercent);
      this.$nextPathPercent = 1 - ((((pathLength - (this.speed.x / 60)) * 100) / this.path.getTotalLength()) / 100);
      return this.path.getPointAtPercent(this.$nextPathPercent);
    }

    return new Point(
      this.inst.components.transform.position.x + (this.speed.x / 60) * (this.speed.y !== 0 ? 0.5 : 1),
      this.inst.components.transform.position.y + (this.speed.y / 60) * (this.speed.x !== 0 ? 0.5 : 1),
    );
  }

  calcAngleAtPosition(nextPos: Point): number {
    const delta = this.inst.components.transform.position.delta(nextPos);
    const direction = new Vector(delta.x < 0 ? -1 : 1, delta.y < 0 ? -1 : 1);

    const a = nextPos;
    const b = this.inst.components.transform.position;
    const c = new Point(a.x, b.y);

    const ab = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    const cb = Math.sqrt((b.x - c.x) ** 2 + (b.y - c.y) ** 2);

    // in radian
    return (direction.x * direction.y * Math.acos(cb / ab) * 180) / Math.PI;
  }

  get realSpeed(): Vector {
    return new Vector(this.speedX / 60, this.speedY / 60);
  }

  set speedX(x: number) {
    this.speed.x = x;
    if (this.inst.hasComponent('AttachedEntities')) {
      Object
        .values(this.inst.getAttachedEntities())
        .forEach((entity) => {
          if (entity.hasComponent('Locomotor')) {
            entity.components.locomotor!.speedX = x;
          }
        })
      ;
    }
  }

  set speedY(y: number) {
    this.speed.y = y;
    if (this.inst.hasComponent('AttachedEntities')) {
      Object
        .values(this.inst.getAttachedEntities())
        .forEach((entity) => {
          if (entity.hasComponent('Locomotor')) {
            entity.components.locomotor!.speedY = y;
          }
        })
      ;
    }
  }

  track(entity: EntityScript) {
    this.trackedEntity = entity;
    this.inst.addTag('tracking');
  }

  toDebugObject() {
    return {
      speed: this.speed,
      canMove: this.canMove,
      path: this.path?.toSvgPath() ?? '',
      followSlope: this.followSlope,
      trackedEntity: this.trackedEntity?.components?.sprite?.id ?? null,
    };
  }

  task() {
    if (!this.inst.hasTag('attached')) {
      if (this.trackedEntity?.hasTag('isDead') || (this.inst.hasTag('tracking') && !this.trackedEntity)) {
        this.trackedEntity = typeof this.retargetFn === 'function'
          ? this.retargetFn()
          : null
        ;
        if (this.trackedEntity && this.inst.hasComponent('EventEmitter')) {
          this.inst.emit('trackerAquireNewTarget', { target: this.trackedEntity });
        }
      }
      if (this.trackedEntity) {
        this.inst.bindPath(ComplexePath.fromSvgString(`M ${this.inst.components.transform.position.x} ${this.inst.components.transform.position.y} L ${this.trackedEntity.components.transform.position.x + (this.trackedEntity.components.sprite.width / 2) - (this.inst.components.sprite.width / 2)} ${this.trackedEntity.components.transform.position.y + (this.trackedEntity.components.sprite.height / 2) - (this.inst.components.sprite.height / 2)}`), false);
      }
      if (this.path) {
        this.inst.move();
      }
    }
  }

  render() {
    if (Global.Settings.debug.drawHitbox && this.inst.hasComponent('Physics')) {
      this.inst.getHitbox().forEach((hitbox) => {
        hitbox.render(Global.Game.ctx, String(this.inst.getId()));
      });
    }
    if (this.inst.hasTag('debug-path') || (Global.Settings.debug.drawPath && !this.inst.hasTag('attached') && this.path)) {
      this.path.debugDraw(Global.Game.ctx);
    }
  }
}
