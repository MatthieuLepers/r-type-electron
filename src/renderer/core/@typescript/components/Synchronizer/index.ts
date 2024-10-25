import Component from '@renderer/core/@typescript/components/Component';
import { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export interface ISyncEntity {
  entity: EntityScript;
  sync: boolean;
}

export default class Synchronizer extends Component<EntityScript> {
  public syncEntities: Record<string, ISyncEntity> = {};

  unsyncAll() {
    Object.values(this.syncEntities).forEach((syncEntity) => {
      syncEntity.sync = false;
    });
  }

  addEntity(entity: EntityScript & ISprite) {
    this.syncEntities[entity.getId()] = {
      entity,
      sync: false,
    };
  }

  syncEntity(entity: EntityScript & ISprite, syncData: Record<string, any>) {
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
