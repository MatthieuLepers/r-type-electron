import Frame, { type IFrameData } from '@renderer/core/classes/ressources/Frame';

export interface IAnimationData {
  name: string;
  frames: Array<IFrameData>;
}

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Animation {
  public name: string;

  public frames: Array<Frame>;

  constructor(
    image: HTMLImageElement,
    data: IAnimationData,
    frameAmount: number,
  ) {
    this.name = data.name;
    this.frames = data.frames.map((frameData) => new Frame(image, frameData, frameAmount));
  }
}
