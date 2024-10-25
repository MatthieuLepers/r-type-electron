import Global from '@renderer/core/stores/AppStore';

import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import Spawner from '@renderer/core/@typescript/prefabs/Spawner';
import Bug from '@renderer/core/@typescript/prefabs/enemies/Bug';
import Point from '@renderer/core/@typescript/geometry/Point';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class BugSpawner extends Spawner {
  public path: ComplexePath = ComplexePath
    .fromSvgString('M 700 300 C 400 500 400 100 100 300')
    .moveTo(new Point(Global.Game.canvas.width, Global.Random.rnd(0, Global.Game.canvas.height - 32)));

  constructor(amount: number) {
    super();
    this.addEntity(Bug, amount ?? 10, 15, this.onSpawn.bind(this));
  }

  onSpawn(entity: PhysicEntityScript) {
    entity.bindPath(this.path);
    entity.setTransform(this.path.startPoint.x, this.path.startPoint.y);
    entity.components.locomotor.followSlope = true;
  }
}
