import { AddClassMethod } from '@renderer/core/utils';
import Class from '@renderer/core/classes/Class';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Component extends Class {
  /**
   * @constructor
   * @param {Class} inst
   * @param {Class} clazz
   * @param {Number} priority
   */
  constructor(inst, clazz, priority = Component.PRIORITY_NORMAL) {
    super();
    if (this.constructor.name === 'Component') {
      throw new AbstractClassError(this);
    }
    this.inst = inst;
    this.clazz = clazz;
    this.priority = priority;

    /**
     * @return {Component[]}
     */
    AddClassMethod(this.clazz, 'getComponentByPriority', function () {
      return Object.values(this.components).sort((a, b) => a.priority - b.priority);
    });
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

  /**
   * @param {ModManager} ModKnowledge
   */
  applyModsBundle(ModKnowledge) {
    ModKnowledge.applyComponentBundle(this.constructor.name, this);
  }
}
