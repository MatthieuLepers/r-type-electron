import Global from '@renderer/core/stores/AppStore';
import Component from '@renderer/core/classes/components/Component';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';
import AbstractMethodNotImplementedError from '@renderer/core/classes/errors/AbstractMethodNotImplementedError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class DrawableComponent extends Component {
  /**
   * @constructor
   * @param {Class} inst
   * @param {Class} clazz
   * @param {Number} priority
   */
  constructor(inst, clazz, priority = Component.PRIORITY_NORMAL) {
    super(inst, clazz, priority);
    if (this.constructor.name === 'DrawableComponent') {
      throw new AbstractClassError(this);
    }
    Global.Game.canvasObj.addDrawable(this);
  }

  render() {
    throw new AbstractMethodNotImplementedError('render', this);
  }
}
