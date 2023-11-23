import Class from '@renderer/core/classes/Class';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

export enum ComponentPriorityEnum {
  LOW = 1,
  NORMAL = 0,
  HIGH = 1,
}

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default abstract class Component extends Class {
  constructor(
    public inst: Class,
    public clazz: Function,
    public priority = ComponentPriorityEnum.NORMAL,
  ) {
    super();
    if (this.constructor.name === 'Component') {
      throw new AbstractClassError(this);
    }
  }

  task?(frame: number): void;

  /**
   * @param {ModManager} ModKnowledge
   */
  applyModsBundle(ModKnowledge) {
    ModKnowledge.applyComponentBundle(this.constructor.name, this);
  }
}
