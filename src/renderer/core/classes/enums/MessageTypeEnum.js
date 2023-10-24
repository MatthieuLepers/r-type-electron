import Enum from '@renderer/core/classes/enums/Enum';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class MessageTypeEnum extends Enum {
  /**
   * @return {String}
   */
  static get ERROR() {
    return 'Error';
  }

  /**
   * @return {String}
   */
  static get HELP() {
    return 'Help';
  }
}
