import { mix } from '@renderer/core/@types/Mixable';
import Class from '@renderer/core/@typescript/Class';
import { EventEmitterMixin } from '@renderer/core/@typescript/components/EventEmitter/mixin';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import Spawner, { ISpawnableEntity } from '@renderer/core/@typescript/prefabs/Spawner';

export default class GameWave extends mix(Class).with(EventEmitterMixin) {
  public $spawnedEntities: Record<string, number> = {};

  public $despawnedEntities: Record<string, number> = {};

  public spawners: Array<Spawner>;

  constructor(
    public id: number,
    public data: Array<ISpawnableEntity>,
  ) {
    super();

    this.spawners = this.data.map(({ entity, amount, delay }) => {
      this.$spawnedEntities[entity.name] = 0;
      this.$despawnedEntities[entity.name] = 0;

      const spawner = new Spawner();
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

  onEntitySpawn(entity: EntityScript) {
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
