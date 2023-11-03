import Class from '@renderer/core/classes/Class';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Random extends Class {
  /**
   * @constructor
   * @param {Number} baseSeed
   */
  constructor(baseSeed = 6) {
    super();
    this.seed = baseSeed;
  }

  /**
   * @param {Number} max
   * @param {Number} min
   * @return {Number}
   */
  rnd(max = 1, min = 0) {
    this.seed = ((this.seed * 9301) + 49297) % 233280;
    return min + ((this.seed / 233280) * (max - min));
  }

  /**
   * @param {Object[]} weightedObjList
   * @return {Object}
   */
  weighted(weightedObjList = []) {
    const weightList = weightedObjList.map(({ weight }) => weight);
    const weightSum = weightList.reduce((sum, w) => sum + w);
    let choice = this.rnd(weightSum);
    let idx = weightList.length - 1;

    while ((choice - weightList[idx]) > 0) {
      choice -= weightList[idx];
      idx -= 1;
    }
    return weightedObjList[idx];
  }
}
