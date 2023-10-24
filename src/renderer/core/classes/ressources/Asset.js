import AbstractRessource from '@renderer/core/classes/ressources/AbstractRessource';
import Animation from '@renderer/core/classes/ressources/Animation';

export default class Asset extends AbstractRessource {
  /**
   * @param {HTMLImageElement} image
   * @param {Object} data
   */
  constructor(image, data = {}) {
    super(data);
    this.image = image;
    this.animations = {};

    this.loadAnimations();
  }

  /**
   * @return {Number}
   */
  get frames() {
    return this.$data.frames ?? 1;
  }

  /**
   * @return {Number}
   */
  get height() {
    return this.image.naturalHeight ?? 0;
  }

  loadAnimations() {
    if (this.$data.animationData) {
      const { totalFrames, animations } = this.$data.animationData;
      this.$data.frames = totalFrames ?? 1;
      this.animations = animations.reduce((acc, animData) => {
        const anim = new Animation(this.image, animData, this.$data.frames);
        return { ...acc, [anim.name]: anim };
      }, {});
    }
  }

  /**
   * @return {Asset}
   */
  clone() {
    const asset = new Asset(this.image.cloneNode(true), this.$data);
    asset.animations = this.animations;
    return asset;
  }
}
