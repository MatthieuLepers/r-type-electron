import Global from '@renderer/core/stores/AppStore';
import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';
import DrawableComponent from '@renderer/core/classes/components/DrawableComponent';
import Direction from '@renderer/core/classes/enums/Direction';
import Vector from '@renderer/core/classes/geometry/Vector';
import Point from '@renderer/core/classes/geometry/Point';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Locomotor extends DrawableComponent {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz, Component.PRIORITY_LOW);
    this.canMove = false;
    this.$currentDirection = [];

    this.path = null;
    this.$pathLoop = true;
    this.$pathPercent = 0.0;
    this.$nextPathPercent = null;
    this.$loopCount = 0;
    this.followSlope = false;
    this.trackedEntity = null;
    this.retargetFn = () => null;

    this.speed = new Vector(0, 0); // px/s => (1/60) px/frame

    AddClassMethod(this.clazz, 'move', function () {
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
    });

    /**
     * @param {Path} path
     * @param {Boolean} loop
     */
    AddClassMethod(this.clazz, 'bindPath', function (path, loop = true) {
      this.unbindPath();
      this.components.locomotor.path = path;
      this.components.locomotor.$pathLoop = loop;
      this.components.transform.position = path.startPoint.clone();
    });

    AddClassMethod(this.clazz, 'unbindPath', function () {
      this.components.locomotor.path = null;
      this.components.locomotor.$pathLoop = true;
      this.components.locomotor.$pathPercent = 0.0;
      this.components.locomotor.$nextPathPercent = null;
    });
  }

  setDirections() {
    this.$currentDirection = [];
    if (this.speed.x > 0) {
      this.$currentDirection.push(Direction.RIGHT);
    } else if (this.speed.x < 0) {
      this.$currentDirection.push(Direction.LEFT);
    }
    if (this.speed.y > 0) {
      this.$currentDirection.push(Direction.BOTTOM);
    } else if (this.speed.y < 0) {
      this.$currentDirection.push(Direction.TOP);
    }
  }

  /**
   * @return {Point}
   */
  calcNextPosition() {
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

  /**
   * @param {Point} nextPos
   * @return {Number} - rad
   */
  calcAngleAtPosition(nextPos) {
    const delta = this.inst.components.transform.position.delta(nextPos);
    const direction = new Vector(delta.x < 0 ? -1 : 1, delta.y < 0 ? -1 : 1);

    const a = nextPos;
    const b = this.inst.components.transform.position;
    const c = new Point(a.x, b.y);

    const ab = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    const cb = Math.sqrt((b.x - c.x) ** 2 + (b.y - c.y) ** 2);
    return (direction.x * direction.y * Math.acos(cb / ab) * 180) / Math.PI;
  }

  /**
   * @return {Vector}
   */
  get realSpeed() {
    return new Vector(this.speedX / 60, this.speedY / 60);
  }

  /**
   * @param {Number} x
   */
  set speedX(x) {
    this.speed.x = x;
    if (this.inst.hasComponent('AttachedEntities')) {
      Object
        .values(this.inst.getAttachedEntities())
        .forEach((entity) => { entity.components.locomotor.speedX = x; })
      ;
    }
  }

  /**
   * @param {Number} y
   */
  set speedY(y) {
    this.speed.y = y;
    if (this.inst.hasComponent('AttachedEntities')) {
      Object
        .values(this.inst.getAttachedEntities())
        .forEach((entity) => { entity.components.locomotor.speedY = y; })
      ;
    }
  }

  /**
   * @param {EntityScript} entity
   */
  track(entity) {
    this.trackedEntity = entity;
    this.inst.addTag('tracking');
  }

  task() {
    if (!this.inst.hasTag('attached')) {
      if (this.trackedEntity?.hasTag('isDead') || (this.inst.hasTag('tracking') && !this.trackedEntity)) {
        this.trackedEntity = this.retargetFn();
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
        hitbox.render(Global.Game.ctx, this.inst.getId());
      });
    }
    if (Global.Settings.debug.drawPath && !this.inst.hasTag('attached') && this.path) {
      this.path.debugDraw(Global.Game.ctx);
    }
  }
}
