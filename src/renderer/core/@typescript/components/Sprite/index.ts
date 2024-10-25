import Global from '@renderer/core/stores/AppStore';

import DrawableComponent from '@renderer/core/@typescript/components/DrawableComponent';
import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import Point from '@renderer/core/@typescript/geometry/Point';
import type Asset from '@renderer/core/@typescript/ressources/Asset';
import type Animation from '@renderer/core/@typescript/ressources/Animation';
import type Frame from '@renderer/core/@typescript/ressources/Frame';

export interface ISpriteOptions {
  id: string;
  asset: Asset | null;
  animation: string;
  loop: boolean;
  rotation: number;
  origin: Point;
  animationDelay: number;
}

export default class Sprite extends DrawableComponent<EntityScript & ISprite> {
  public options: ISpriteOptions = {
    id: String(new Date().getTime()),
    asset: null,
    animation: 'idle',
    loop: false,
    rotation: 0,
    origin: new Point(0, 0),
    animationDelay: 4,
  };

  public visible: boolean = true;

  public $currentFrameIndex: number = 0;

  public $currentTick: number = 0;

  init(options: Partial<ISpriteOptions>) {
    Object.assign(this.options, options);
    this.$currentFrameIndex = 0;
    this.$currentTick = 0;
  }

  get id(): string {
    return this.options.id;
  }

  get width(): number {
    return this.frame?.width ?? 0;
  }

  get height(): number {
    return this.frame?.height ?? 0;
  }

  get animation(): Animation | null {
    return this.options.asset?.animations[this.options.animation] ?? null;
  }

  get frame(): Frame | null {
    return this.animation?.frames[this.$currentFrameIndex] ?? null;
  }

  get centerOrigin(): Point {
    return new Point(
      this.inst.components.transform.position.x + (this.width / 2),
      this.inst.components.transform.position.y + (this.height / 2),
    );
  }

  get rotationOrigin(): Point {
    if (this.options.origin.x !== 0 || this.options.origin.y !== 0) {
      return this.options.origin.clone();
    }
    return new Point(this.width / 2, this.height / 2);
  }

  isMultipleWidth(): boolean {
    return !(this.animation?.frames ?? [])
      .map((f) => f.width)
      .every((val, _i, arr) => val === arr[0])
    ;
  }

  isMultipleHeight(): boolean {
    return !(this.animation?.frames ?? [])
      .map((f) => f.height)
      .every((val, _i, arr) => val === arr[0])
    ;
  }

  getMaxFrameWidth(): number {
    return Math.max(...(this.animation?.frames ?? []).map((f) => f.width));
  }

  getMaxFrameHeight(): number {
    return Math.max(...(this.animation?.frames ?? []).map((f) => f.height));
  }

  update() {
    this.$currentTick += 1;

    if (this.$currentTick > this.options.animationDelay && this.animation) {
      this.$currentTick = 0;
      if (this.$currentFrameIndex < this.animation.frames.length - 1) {
        this.$currentFrameIndex += 1;
        this.inst.emit('animProgress', {
          anim: this.animation.name,
          frame: this.$currentFrameIndex,
        });
      } else if (this.options.loop) {
        if (this.inst.hasComponent('EventEmitter')) {
          this.inst.emit('animLoop', { anim: this.animation.name });
        }
        this.$currentFrameIndex = 0;
      }
    }

    if (this.animation && this.$currentFrameIndex >= this.animation.frames.length - 1 && !this.options.loop && this.inst.hasComponent('EventEmitter')) {
      this.inst.emit('animOver', { anim: this.animation.name });
    }
  }

  remove() {
    Global.Game.canvasObj.removeDrawable(this);
  }

  toDebugObject() {
    return {
      id: this.options.id,
      asset: this.options.asset?.toDebugObject() ?? null,
      animation: this.options.animation,
      loop: this.options.loop,
      rotation: this.options.rotation,
      origin: this.options.origin,
      animationDelay: this.options.animationDelay,
      centerOrigin: this.centerOrigin,
      rotationOrigin: this.rotationOrigin,
      isMultipleWidth: this.isMultipleWidth(),
      isMultipleHeight: this.isMultipleHeight(),
    };
  }

  render() {
    if (this.visible) {
      this.update();

      if (this.options.rotation !== 0) {
        Global.Game.ctx.save();
        if (this.options.origin.x !== 0 || this.options.origin.y !== 0) {
          Global.Game.ctx.translate(this.inst.components.transform.getPosition().x + this.options.origin.x, this.inst.components.transform.getPosition().y + this.options.origin.y);
        } else {
          Global.Game.ctx.translate(this.centerOrigin.x, this.centerOrigin.y);
        }
        Global.Game.ctx.rotate((this.options.rotation * Math.PI) / 180);
      }
      if (this.options.asset && this.frame) {
        Global.Game.ctx.drawImage(
          this.options.asset.image,
          this.frame.origin.x,
          this.frame.origin.y,
          this.width,
          this.height,
          (this.options.rotation !== 0 ? -this.rotationOrigin.x : this.inst.components.transform.getPosition().x),
          (this.options.rotation !== 0 ? -this.rotationOrigin.y : this.inst.components.transform.getPosition().y),
          this.width,
          this.height,
        );
      }
      if (this.options.rotation !== 0) {
        Global.Game.ctx.restore();
      }
    }
  }

  task() {
    if (!this.inst.isVisible()) {
      if (this.inst.hasComponent('EventEmitter')) {
        this.inst.emit('outOfScreen');
      }
      if (!this.inst.hasTag('staySpawned')) {
        this.inst.despawn();
      }
    }
  }
}
