import Frame from '@renderer/core/classes/ressources/Frame';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Animation {
  /**
   * @param {HTMLImageElement} image
   * @param {Object} data
   * @param {Number} frameAmount
   */
  constructor(image, data, frameAmount) {
    this.name = data.name;
    this.frames = data.frames.map((frameData) => new Frame(image, frameData, frameAmount));
  }
}
