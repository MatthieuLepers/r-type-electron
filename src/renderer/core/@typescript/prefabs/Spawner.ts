import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Runnable from '@renderer/core/@typescript/runnable/Runnable';

export interface ISpawnableEntity {
  entity: AnyConstructor<PhysicEntityScript>;
  amount: number;
  delay: number; // frame delay
  onSpawnFn?: (entity: PhysicEntityScript) => void;
}

export default class Spawner extends EntityScript {
  public entities: Array<ISpawnableEntity> = [];

  public $baseFrame: number = 0;

  public $spawned: number = 0;

  public $maxEntities: number = 0;

  addEntity(entity: AnyConstructor<PhysicEntityScript>, amount: number, delay: number, onSpawnFn: ISpawnableEntity['onSpawnFn']) {
    this.$maxEntities += amount;
    this.entities.push({
      entity,
      amount,
      delay,
      onSpawnFn,
    });
  }

  getSpawnerName(): string {
    const entityNameList = this.entities.map(({ entity }) => entity.name).join().toLowerCase();
    return `spawner_${entityNameList}_${Global.Game.uniqid()}`;
  }

  spawn(): Spawner {
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
    this.emit('spawn', { entity: this });

    return this;
  }

  despawn() {
    Global.Engine.removeRunnable(this.runnable);
    super.despawn();
  }

  getNextDelay(): number {
    const [data] = this.entities;
    return data?.delay ?? 0;
  }

  getNextEntityToSpawn(): PhysicEntityScript {
    const [data] = this.entities;

    data.amount -= 1;

    if (data.amount === 0) {
      this.entities.shift();
    }

    const entity = new data.entity();
    if (typeof data.onSpawnFn === 'function') {
      data.onSpawnFn(entity);
    }
    return entity;
  }

  isFinished(): boolean {
    return this.$spawned === this.$maxEntities;
  }
}
