import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Frame {
  /**
   * @param {HTMLImageElement} image
   * @param {Object} data
   * @param {Number} frameAmount
   */
  constructor(image, data, frameAmount) {
    this.data = {
      index: 0,
      width: 0,
      height: 0,
      origin: new Point(0, 0),
    };

    Object.assign(this.data, data);

    this.data.width = (data.width !== undefined ? data.width : (image.naturalWidth / frameAmount));
    this.data.height = data.height ?? image.naturalHeight;
    this.data.origin = new Point(data.x ?? (this.index * this.width), data.y ?? 0);
  }

  /**
   * @return {Number}
   */
  get index() {
    return this.data.index;
  }

  /**
   * @return {Number}
   */
  get width() {
    return this.data.width;
  }

  /**
   * @return {Number}
   */
  get height() {
    return this.data.height;
  }

  /**
   * @return {Point}
   */
  get origin() {
    return this.data.origin;
  }
}
