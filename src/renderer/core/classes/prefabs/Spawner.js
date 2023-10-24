import Global from '@renderer/core/stores/AppStore';
import EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import Runnable from '@renderer/core/classes/runnable/Runnable';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Spawner extends EntityScript {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options = {}) {
    super();
    this.entities = [];
    this.options = {};
    this.$baseFrame = 0;
    this.$spawned = 0;
    this.$maxEntities = 0;

    Object.assign(this.options, options);
  }

  /**
   * @param {EntityScript} entity
   * @param {Number} amount
   * @param {Number} delay
   * @param {Function} onSpawnFn
   */
  addEntity(entity, amount, delay, onSpawnFn) {
    this.$maxEntities += amount;
    this.entities.push({
      entity,
      amount,
      delay, // frame delay
      onSpawnFn,
    });
  }

  /**
   * @return {String}
   */
  getSpawnerName() {
    const entityNameList = this.entities.map(({ entity }) => entity.name).join().toLowerCase();
    return `spawner_${entityNameList}_${Global.Game.uniqid()}`;
  }

  spawn() {
    this.runnable = new Runnable(this.getSpawnerName(), () => {
      if (this.entities.length && Global.Engine.FRAME >= this.$baseFrame + this.$spawned * this.getNextDelay()) {
        this.getNextEntityToSpawn().spawn();
        this.$spawned += 1;
      } else if (!this.entities.length && this.isFinished()) {
        Global.Engine.removeRunnable(this.runnable);
        this.emit('finishSpawning');
      }
    });

    this.$baseFrame = Global.Engine.FRAME;
    Global.Engine.addRunnable(this.runnable);
  }

  despawn() {
    Global.Engine.removeRunnable(this.runnable);
    super.despawn();
  }

  /**
   * @return {Number}
   */
  getNextDelay() {
    const [data] = this.entities;
    return data?.delay ?? 0;
  }

  /**
   * @return {EntityScript}
   */
  getNextEntityToSpawn() {
    const [data] = this.entities;

    data.amount -= 1;

    if (data.amount === 0) {
      this.entities.shift();
    }

    const entity = data.entity.new();
    if (typeof data.onSpawnFn === 'function') {
      data.onSpawnFn(entity);
    }
    return entity;
  }

  /**
   * @return {Boolean}
   */
  isFinished() {
    return this.$spawned === this.$maxEntities;
  }
}
