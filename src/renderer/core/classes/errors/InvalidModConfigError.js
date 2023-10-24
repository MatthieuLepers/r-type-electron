/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class InvalidModConfigError extends Error {
  /**
   * @constructor
   * @param {Object} clazz
   */
  constructor(clazz) {
    super(`[Mod] Cannot find a valid configuration file for mod "${clazz.constructor.name}"`);
  }
}
