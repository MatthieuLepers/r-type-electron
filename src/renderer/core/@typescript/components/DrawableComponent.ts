import Global from '@renderer/core/stores/AppStore';

import AbstractMethodNotImplementedError from '@renderer/core/@typescript/errors/AbstractMethodNotImplementedError';

import Component, { Priority } from '@renderer/core/@typescript/components/Component';

export default class DrawableComponent<T> extends Component<T> {
  constructor(
    inst: T,
    clazz: Function,
    priority: number = Priority.NORMAL,
  ) {
    super(inst, clazz, priority);
    Global.Game.canvasObj.addDrawable(this);
  }

  render() {
    if (this.constructor.name === '') {
      throw new AbstractMethodNotImplementedError('renderer', this.constructor);
    }
  }
}
