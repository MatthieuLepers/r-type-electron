/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class AbstractClassError extends Error {
  /**
   * @constructor
   * @param {Object} clazz
   */
  constructor(clazz) {
    super(`Cannot instanciate abstract class ${clazz.constructor.name}`);
  }
}
