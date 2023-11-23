import Component, { ComponentPriorityEnum } from '@renderer/core/classes/components/Component';

import Class from '@renderer/core/classes/Class';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

import Global from '@renderer/core/stores/AppStore';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default abstract class DrawableComponent extends Component {
  constructor(
    inst: Class,
    clazz: Function,
    priority = ComponentPriorityEnum.NORMAL,
  ) {
    super(inst, clazz, priority);
    if (this.constructor.name === 'DrawableComponent') {
      throw new AbstractClassError(this);
    }
    Global.Game.canvasObj.addDrawable(this);
  }

  abstract render(): void;
}
