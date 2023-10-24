/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class AbstractMethodNotImplementedError extends Error {
  /**
   * @param {String} methodName
   * @param {Object} clazz
   */
  constructor(methodName, clazz) {
    super(`You must implement abstract method '${methodName}' in class '${clazz.constructor.name}'`);
  }
}
