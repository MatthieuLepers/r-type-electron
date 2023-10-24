import Enum from '@renderer/core/classes/enums/Enum';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Direction extends Enum {
  /**
   * @return {String}
   */
  static get UP() {
    return 'up';
  }

  /**
   * @return {String}
   */
  static get DOWN() {
    return 'down';
  }

  /**
   * @return {String}
   */
  static get LEFT() {
    return 'left';
  }

  /**
   * @return {String}
   */
  static get RIGHT() {
    return 'right';
  }
}
