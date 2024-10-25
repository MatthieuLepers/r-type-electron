import Component from '@renderer/core/@typescript/components/Component';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export default class AttachedEntities extends Component<EntityScript> {
  public entities: Record<string, EntityScript> = {};

  toDebugObject() {
    return {
      entities: Object
        .entries(this.entities)
        .reduce((acc, [name, entity]) => ({
          ...acc,
          [name]: entity.toDebugObject(),
        }), {}),
    };
  }
}
