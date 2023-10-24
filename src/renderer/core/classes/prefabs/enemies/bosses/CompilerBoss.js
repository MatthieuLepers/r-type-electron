import Global from '@renderer/core/stores/AppStore';
import CompilerBossTopPart from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossTopPart';
import CompilerBossRightPart from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossRightPart';
import CompilerBossBottomPart from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossBottomPart';
import EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import AttachedEntities from '@renderer/core/classes/components/AttachedEntities';
import Locomotor from '@renderer/core/classes/components/Locomotor';
import Transform from '@renderer/core/classes/components/Transform';
import Point from '@renderer/core/classes/geometry/Point';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class CompilerBoss extends EntityScript {
  /**
   * @constructor
   */
  constructor() {
    super();

    this.addTag('boss', 'alwaysVisible', 'staySpawned');
    this.addComponent(AttachedEntities, CompilerBoss);
    this.addComponent(Locomotor, CompilerBoss);
    this.addComponent(Transform, CompilerBoss);

    // Locomotor
    this.components.locomotor.speedX = 90;

    this.bindPath(ComplexePath.fromSvgString('M 100 0 L 0 0').moveTo(new Point(Global.Game.canvas.width, Global.Game.canvas.height / 2 - 48)));
    this.components.locomotor.canMove = true;

    // AttachedEntities
    this.attachEntity(CompilerBossTopPart.new(this), 'top_part');
    this.attachEntity(CompilerBossBottomPart.new(this), 'bottom_part');
    this.attachEntity(CompilerBossRightPart.new(this), 'right_part');

    this.on('move', () => {
      if (this.components.transform.position.x <= Global.Game.canvas.width / 2 - 70) {
        this.components.locomotor.speedX = 0;
      }
    });
  }

  /**
   * @return {String}
   */
  getId() {
    return 'compilerboss';
  }
}
