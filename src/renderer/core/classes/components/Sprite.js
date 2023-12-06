import Global from '@renderer/core/stores/AppStore';
import { AddClassMethod } from '@renderer/core/utils';
import DrawableComponent from '@renderer/core/classes/components/DrawableComponent';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Sprite extends DrawableComponent {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.options = {
      id: new Date().getTime(),
      asset: null,
      animation: 'idle',
      loop: false,
      rotation: 0,
      origin: new Point(0, 0),
      animationDelay: 4,
    };
    this.$currentFrameIndex = 0;
    this.$currentTick = 0;
    this.visible = true;

    /**
     * @return {String}
     */
    AddClassMethod(this.clazz, 'getId', function () {
      return this.components.sprite.id;
    });

    /**
     * @param {String} animName
     * @param {Boolean} loop
     */
    AddClassMethod(this.clazz, 'playAnimation', function (animName, loop = false) {
      this.components.sprite.options.animation = animName;
      this.components.sprite.options.loop = loop;
      this.components.sprite.$currentFrameIndex = 0;
      this.components.sprite.$currentTick = 0;
      if (this.hasComponent('EventEmitter')) {
        this.emit('animStart', { anim: animName });
      }
    });

    /**
     * @return {Boolean}
     */
    AddClassMethod(this.clazz, 'isVisible', function () {
      return this.components.transform.position.x > -this.components.sprite.width
        && this.components.transform.position.x < Global.Game.canvas.width + this.components.sprite.width
        && this.components.transform.position.y > -this.components.sprite.height
        && this.components.transform.position.y < Global.Game.canvas.height + this.components.sprite.height
      ;
    });

    AddClassMethod(this.clazz, 'hide', function () {
      this.components.sprite.visible = false;
    });

    AddClassMethod(this.clazz, 'show', function () {
      this.components.sprite.visible = true;
    });
  }

  /**
   * @param {Object} options
   */
  init(options) {
    Object.assign(this.options, options);
    this.$currentFrameIndex = 0;
    this.$currentTick = 0;
    return this;
  }

  /**
   * @return {String}
   */
  get id() {
    return this.options.id;
  }

  /**
   * @return {Number}
   */
  get width() {
    return this.frame.width;
  }

  /**
   * @return {Number}
   */
  get height() {
    return this.frame.height;
  }

  /**
   * @return {Animation}
   */
  get animation() {
    return this.options.asset.animations[this.options.animation];
  }

  /**
   * @return {Frame}
   */
  get frame() {
    return this.animation.frames[this.$currentFrameIndex];
  }

  /**
   * @return {Point}
   */
  get centerOrigin() {
    return new Point(
      this.inst.components.transform.position.x + (this.width / 2),
      this.inst.components.transform.position.y + (this.height / 2),
    );
  }

  /**
   * @return {Point}
   */
  get rotationOrigin() {
    if (this.options.origin.x !== 0 || this.options.origin.y !== 0) {
      return this.options.origin.clone();
    }
    return new Point(this.width / 2, this.height / 2);
  }

  /**
   * @return {Boolean}
   */
  isMultipleWidth() {
    return !this.animation.frames
      .map((f) => f.width)
      .every((val, i, arr) => val === arr[0])
    ;
  }

  /**
   * @return {Boolean}
   */
  isMultipleHeight() {
    return !this.animation.frames
      .map((f) => f.height)
      .every((val, i, arr) => val === arr[0])
    ;
  }

  /**
   * @return {Integer}
   */
  getMaxFrameWidth() {
    return Math.max(...this.animation.frames.map((f) => f.width));
  }

  /**
   * @return {Integer}
   */
  getMaxFrameHeight() {
    return Math.max(...this.animation.frames.map((f) => f.height));
  }

  update() {
    this.$currentTick += 1;

    if (this.$currentTick > this.options.animationDelay) {
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

    if (this.$currentFrameIndex >= this.animation.frames.length - 1 && !this.options.loop && this.inst.hasComponent('EventEmitter')) {
      this.inst.emit('animOver', { anim: this.animation.name });
    }
  }

  remove() {
    Global.Game.canvas.deleteDrawable(this.id);
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
