import Global from '@renderer/core/stores/AppStore';
import CompilerBossTopPart from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossTopPart';
import CompilerBossRightPart from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossRightPart';
import CompilerBossBottomPart from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBossBottomPart';
import EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import AttachedEntities from '@renderer/core/classes/components/AttachedEntities';
import Locomotor from '@renderer/core/classes/components/Locomotor';
import Transform from '@renderer/core/classes/components/Transform';
import Synchronizer from '@renderer/core/classes/components/Synchronizer';
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
    this.addComponent(Synchronizer, CompilerBoss);

    // Locomotor
    this.components.locomotor.speedX = 90;
    this.bindPath(ComplexePath.fromSvgString(`M-200,${(Global.Game.canvasObj.height / 2) - 80}L${Global.Game.canvasObj.width - 240},${(Global.Game.canvasObj.height / 2) - 80}`), false);
    this.components.locomotor.canMove = true;

    // AttachedEntities
    this.compilerBossTopPart = CompilerBossTopPart.new(this);
    this.compilerBossBottomPart = CompilerBossBottomPart.new(this);
    this.compilerBossRightPart = CompilerBossRightPart.new(this);
    this.attachEntity(this.compilerBossTopPart, 'top_part');
    this.attachEntity(this.compilerBossBottomPart, 'bottom_part');
    this.attachEntity(this.compilerBossRightPart, 'right_part');

    // Synchronizer
    this.components.synchronizer.addEntity(this.compilerBossTopPart);
    this.components.synchronizer.addEntity(this.compilerBossBottomPart);
    this.components.synchronizer.addEntity(this.compilerBossRightPart);

    this.on('pathEnd', async () => {
      this.splitVerticallySequence();
    });
    this.on('synchronized', (e) => {
      this.components.synchronizer.unsyncAll();
      const sequence = e.details.event;

      if (sequence === 'splitVerticallySequence') {
        this.splitedVerticallyVerticalScroll();
      }
    });
  }

  /**
   * @return {String}
   */
  getId() {
    return 'compilerboss';
  }

  splitVerticallySequence() {
    this.detachEntity(this.compilerBossBottomPart, 'bottom_part');
    this.unbindPath();
    this.bindPath(ComplexePath.fromSvgString(`M${this.components.transform.position.x},${this.components.transform.position.y}L${this.components.transform.position.x},48`), false);
    this.on('pathEnd', () => {
      this.components.synchronizer.syncEntity(this.compilerBossTopPart, { event: 'splitVerticallySequence' });
      this.components.synchronizer.syncEntity(this.compilerBossRightPart, { event: 'splitVerticallySequence' });
    }, { once: true });
  }

  /**
   * @param {Number} direction
   */
  splitedVerticallyVerticalScroll(direction = 1) {
    this.compilerBossBottomPart.splitedVerticallyVerticalScroll();
    this.unbindPath();
    this.bindPath(ComplexePath.fromSvgString(`M${direction * this.components.transform.position.x},${this.components.transform.position.y}L${direction * (this.components.transform.position.x - Global.Game.canvasObj.width + 240)},${this.components.transform.position.y}`), false);
    this.on('pathEnd', () => {
      this.components.synchronizer.syncEntity(this.compilerBossTopPart, { event: 'splitedVerticallyVerticalScroll' });
      this.components.synchronizer.syncEntity(this.compilerBossRightPart, { event: 'splitedVerticallyVerticalScroll' });
    }, { once: true });
  }
}
