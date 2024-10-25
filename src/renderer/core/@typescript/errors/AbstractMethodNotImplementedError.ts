export default class AbstractMethodNotImplementedError extends Error {
  constructor(methodName: string, clazz: Function) {
    super(`You must implement abstract method '${methodName}' in class '${clazz.name}'`);
  }
}
