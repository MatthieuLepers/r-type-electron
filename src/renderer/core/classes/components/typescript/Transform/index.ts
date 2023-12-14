import Component, { ComponentPriorityEnum } from '@renderer/core/classes/components/Component';
import Point from '@renderer/core/classes/geometry/Point';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export default class Transform extends Component {
  declare inst: TEntityScript;

  public calcPositionFn: Function | null = null;

  #position: Point = new Point(0, 0);

  constructor(inst: TEntityScript, clazz: Function) {
    super(inst, clazz, ComponentPriorityEnum.LOW);
  }

  add(x: number, y: number) {
    this.position.add(x, y);
    if (this.inst.hasComponent('AttachedEntities')) {
      Object.values(this.inst.getAttachedEntities()).forEach((entity) => {
        if (entity.hasComponent('Transform')) {
          entity.components.transform!.add(x, y);
        }
      });
    }
  }

  get position(): Point {
    return this.#position;
  }

  set position(position: Point) {
    this.#position = position;
  }

  getPosition(): Point {
    return typeof this.calcPositionFn === 'function'
      ? this.calcPositionFn()
      : this.position
    ;
  }
}
