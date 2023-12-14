import Component from '@renderer/core/classes/components/Component';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export interface ISyncEntity {
  entity: EntityScript;
  sync: boolean;
}

export default class Synchronizer extends Component {
  declare inst: TEntityScript;

  public syncEntities: Record<string, ISyncEntity> = {};

  unsyncAll() {
    Object.values(this.syncEntities).forEach((syncEntity) => {
      syncEntity.sync = false;
    });
  }

  addEntity(entity: EntityScript) {
    this.syncEntities[entity.getId()] = {
      entity,
      sync: false,
    };
  }

  syncEntity(entity: EntityScript, syncData: Record<string, any>) {
    if (!this.syncEntities[entity.getId()]) {
      this.addEntity(entity);
    }
    this.syncEntities[entity.getId()].sync = true;
    if (entity.hasComponent('EventEmitter')) {
      entity.emit('synchronizing', syncData);
    }

    const allSync = Object.values(this.syncEntities).every(({ sync }) => sync);
    if (allSync && this.inst.hasComponent('EventEmitter')) {
      this.inst.emit('synchronized', syncData);
    }
  }
}
