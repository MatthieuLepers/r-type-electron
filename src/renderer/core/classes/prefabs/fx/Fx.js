import EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import Locomotor from '@/renderer/core/classes/components/Locomotor';
import Sprite from '@renderer/core/classes/components/Sprite';
import Transform from '@renderer/core/classes/components/Transform';

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
    this.addTag('fx');

    this.addComponent(Transform, Fx);
    this.addComponent(Sprite, Fx);
    this.addComponent(Locomotor, Fx);
  }

  update() {
    this.show();
  }
}
