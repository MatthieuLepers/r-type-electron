import Global from '@renderer/core/stores/AppStore';
import Bug from '@renderer/core/classes/prefabs/enemies/Bug';
import Spawner from '@renderer/core/classes/prefabs/Spawner';
import Point from '@renderer/core/classes/geometry/Point';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class BugSpawner extends Spawner {
  /**
   * @constructor
   * @param {Number} amount
   */
  constructor(amount) {
    super();
    this.addEntity(Bug, amount ?? 10, 15, this.onSpawn.bind(this));
    this.path = ComplexePath.fromSvgString('M 700 300 C 400 500 400 100 100 300').moveTo(new Point(Global.Game.canvas.width, Global.Random.rnd(0, Global.Game.canvas.height - 32)));
  }

  /**
   * @param {EntityScript} entity
   */
  onSpawn(entity) {
    entity.bindPath(this.path);
    entity.setTransform(this.path.startPoint.x, this.path.startPoint.y);
    entity.components.locomotor.followSlope = true;
  }
}
