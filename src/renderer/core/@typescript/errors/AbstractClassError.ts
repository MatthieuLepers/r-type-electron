export default class AbstractClassError extends Error {
  constructor(clazz: Function) {
    super(`Cannot instanciate abstract class ${clazz.name}`);
  }
}
