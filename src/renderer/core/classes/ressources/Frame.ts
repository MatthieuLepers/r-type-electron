import Point from '@renderer/core/classes/geometry/Point';

export interface IFrameData {
  index: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  origin: Point;
}

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Frame {
  public data: IFrameData = {
    index: 0,
    width: 0,
    height: 0,
    origin: new Point(0, 0),
  };

  /**
   * @param {HTMLImageElement} image
   * @param {Object} data
   * @param {Number} frameAmount
   */
  constructor(
    public image: HTMLImageElement,
    data: IFrameData,
    public frameAmount: number,
  ) {
    Object.assign(this.data, data);

    this.data.width = (data.width !== undefined ? data.width : (image.naturalWidth / frameAmount));
    this.data.height = data.height ?? image.naturalHeight;
    this.data.origin = new Point(data.x ?? (this.index * this.width), data.y ?? 0);
  }

  get index(): number {
    return this.data.index;
  }

  get width(): number {
    return this.data?.width ?? (this.image.naturalWidth / this.frameAmount);
  }

  get height(): number {
    return this.data?.height ?? this.image.naturalHeight;
  }

  get origin(): Point {
    return this.data.origin;
  }
}
