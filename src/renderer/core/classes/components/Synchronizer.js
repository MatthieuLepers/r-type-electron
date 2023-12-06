import Component from '@renderer/core/classes/components/Component';

export default class Synchronizer extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.syncEntities = {};
  }

  unsyncAll() {
    Object.values(this.syncEntities).forEach((syncEntity) => {
      syncEntity.sync = false;
    });
  }

  /**
   * @param {EntityScript} entity
   */
  addEntity(entity) {
    this.syncEntities[entity.getId()] = {
      entity,
      sync: false,
    };
  }

  /**
   * @param {EntityScript} entity
   * @param {Object} syncData
   */
  syncEntity(entity, syncData = {}) {
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
