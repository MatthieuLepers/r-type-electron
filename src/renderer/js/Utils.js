/**
 * @param {String} clazz
 * @param {String} methodName
 * @param {Function} methodFn
 */
export const AddClassMethod = (clazz, methodName, methodFn) => {
  clazz.prototype[methodName] = methodFn;
};

/**
 * @param {Class} clazz
 * @param {String} methodName
 * @return {Boolean}
 */
export const ClassMethodExists = (clazz, methodName) => clazz.prototype[methodName] != null;
