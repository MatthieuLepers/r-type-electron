import { AddClassMethod } from '../../Utils';
import Class from '../Class';
import AbstractClassError from '../errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Component extends Class {
  /**
   * @constructor
   * @param {Class} inst
   * @param {Class} clazz
   * @param {Number} updatePriority
   */
  constructor(inst, clazz, updatePriority = Component.PRIORITY_NORMAL) {
    super();
    if (this.constructor.name === 'Component') {
      throw new AbstractClassError(this);
    }
    this.inst = inst;
    this.clazz = clazz;
    this.updatePriority = updatePriority;

    /**
     * @return {Component[]}
     */
    AddClassMethod(this.clazz, 'getComponentByPriority', function () {
      return Object.values(this.components).sort((a, b) => a.updatePriority - b.updatePriority);
    });
  }

  /**
   * @return {Number}
   */
  get priority() {
    return this.updatePriority;
  }

  /**
   * @param {Number} priority
   */
  set priority(priority) {
    this.updatePriority = priority || Component.PRIORITY_NORMAL;
  }

  /**
   * @return {Number}
   */
  static get PRIORITY_LOW() {
    return 1;
  }

  /**
   * @return {Number}
   */
  static get PRIORITY_NORMAL() {
    return 0;
  }

  /**
   * @return {Number}
   */
  static get PRIORITY_HIGH() {
    return -1;
  }
}
