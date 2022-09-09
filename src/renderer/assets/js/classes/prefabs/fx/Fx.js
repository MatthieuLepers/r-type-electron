import EntityScript from '../EntityScript';
import Locomotor from '../../components/Locomotor';
import Sprite from '../../components/Sprite';
import Transform from '../../components/Transform';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Fx extends EntityScript {
  /**
   * @param {EntityScript} parent
   */
  constructor(parent) {
    super();
    this.parent = parent;

    this.addComponent(Transform, Fx);
    this.addComponent(Sprite, Fx);
    this.addComponent(Locomotor, Fx);
  }

  update() {
    this.show();
  }
}
