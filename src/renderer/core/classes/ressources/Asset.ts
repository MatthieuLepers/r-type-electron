import AbstractRessource from '@renderer/core/classes/ressources/AbstractRessource';
import Animation, { type IAnimationData } from '@renderer/core/classes/ressources/Animation';

export interface IAssetData {
  bank: string;
  spritesheetPath: string;
  animationData?: {
    totalFrames: number;
    animations: Array<IAnimationData>;
  },
}

export default class Asset extends AbstractRessource<IAssetData> {
  public animations: Record<string, Animation>;

  constructor(
    public image: HTMLImageElement,
    data: IAssetData,
  ) {
    super(data);
    this.image = image;
    this.animations = {};

    this.loadAnimations();
  }

  /**
   * @return {Number}
   */
  get frames() {
    return this.data?.animationData?.totalFrames ?? 1;
  }

  get height(): number {
    return this.image.naturalHeight ?? 0;
  }

  loadAnimations() {
    if (this.data.animationData) {
      const { totalFrames, animations } = this.data.animationData;
      this.animations = animations.reduce((acc, animData) => {
        const anim = new Animation(this.image, animData, totalFrames);
        return { ...acc, [anim.name]: anim };
      }, {});
    }
  }

  clone(): Asset {
    const asset = new Asset(this.image.cloneNode(true) as HTMLImageElement, this.data);
    asset.animations = this.animations;
    return asset;
  }
}
