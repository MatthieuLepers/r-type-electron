import Component, { Priority } from '@renderer/core/@typescript/components/Component';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import Point from '@renderer/core/@typescript/geometry/Point';

export default class Transform extends Component<EntityScript> {
  public calcPositionFn: Function | null = null;

  $position: Point = new Point(0, 0);

  constructor(inst: EntityScript, clazz: Function) {
    super(inst, clazz, Priority.LOW);
  }

  add(x: number, y: number) {
    this.position.add(x, y);
    const { attachedentities } = this.inst.components;
    if (attachedentities) {
      Object.values(attachedentities.entities).forEach((entity) => {
        if (entity.hasComponent('Transform')) {
          entity.components.transform.add(x, y);
        }
      });
    }
  }

  get position(): Point {
    return this.$position;
  }

  set position(position: Point) {
    this.$position = position;
  }

  getPosition(): Point {
    return typeof this.calcPositionFn === 'function'
      ? this.calcPositionFn()
      : this.position
    ;
  }

  toDebugObject() {
    return {
      position: this.getPosition(),
    };
  }
}
