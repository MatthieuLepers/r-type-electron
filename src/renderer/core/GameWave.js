import Class from '@renderer/core/classes/Class';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';
import Spawner from '@renderer/core/classes/prefabs/Spawner';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class GameWave extends Class {
  /**
   * @constructor
   * @param {Object} data
   */
  constructor(id, data) {
    super();
    this.id = id;
    this.data = data;
    this.$spawnedEntities = {};
    this.$despawnedEntities = {};

    this.addComponent(EventEmitter, GameWave);

    this.spawners = this.data.map(({ entity, amount, delay }) => {
      this.$spawnedEntities[entity.name] = 0;
      this.$despawnedEntities[entity.name] = 0;

      const spawner = Spawner.new();
      spawner.addEntity(entity, amount, delay, this.onEntitySpawn.bind(this));
      return spawner;
    });

    this.on('waveEnd', () => {
      this.spawners.forEach((spawner) => { spawner.despawn(); });
    });
  }

  spawn() {
    this.spawners.forEach((spawner) => { spawner.spawn(); });
  }

  /**
   * @param {EntityScript} entity
   */
  onEntitySpawn(entity) {
    this.$spawnedEntities[entity.getClass()] += 1;
    entity.on('despawn', () => {
      this.$despawnedEntities[entity.getClass()] += 1;
      this.checkFinished();
    });
  }

  checkFinished() {
    const finished = this.data
      .map(({ entity, amount }) => this.$despawnedEntities[entity.name] === amount)
      .reduce((acc, val) => acc && val, true)
    ;
    if (finished) {
      this.emit('waveEnd', { wave: this });
    }
  }
}
