import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Class {
  /**
   * @constructor
   */
  constructor() {
    if (this.constructor.name === 'Class') {
      throw new AbstractClassError(this);
    }
    this.components = {};
  }

  /**
   * @param {String} component
   * @param {String} clazz
   */
  addComponent(component, clazz) {
    this.addComponentAt(component.name, component, clazz ?? this.constructor);
  }

  /**
   * @param {String} key
   * @param {String} component
   * @param {String} clazz
   */
  addComponentAt(key, component, clazz) {
    this.components[key.toLowerCase()] = new component(this, clazz);
  }

  /**
   * @param {String} component
   */
  removeComponent(component) {
    delete this.components[component.toLowerCase()];
  }

  /**
   * @param {String} component
   * @return {Boolean}
   */
  hasComponent(component) {
    return !!this.components[component.toLowerCase()];
  }

  /**
   * @return {Function}
   */
  getClass() {
    return this.constructor.name;
  }

  /**
   * @return {Function}
   */
  getParentClass() {
    return Object.getPrototypeOf(this.constructor).name;
  }

  /**
   * @return {String[]}
   */
  getAllParentClass() {
    const allParent = [];
    let baseClass = this.constructor;

    while (baseClass) {
      allParent.push(baseClass.name);
      const newBaseClass = Object.getPrototypeOf(baseClass);
      if (newBaseClass && newBaseClass !== Object && newBaseClass.name) {
        baseClass = newBaseClass;
      } else {
        break;
      }
    }

    return allParent;
  }

  /**
   * @param {String} clazz
   * @return {Boolean}
   */
  isExtending(clazz) {
    return this.getAllParentClass().indexOf(typeof clazz !== 'function' ? clazz : clazz.prototype.constructor.name) >= 0;
  }
}
