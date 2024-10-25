import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import { AttachedEntitiesMixin } from '@renderer/core/@typescript/components/AttachedEntities/mixin';
import { LocomotorMixin } from '@renderer/core/@typescript/components/Locomotor/mixin';
import { TransformMixin } from '@renderer/core/@typescript/components/Transform/mixin';
import { SynchronizerMixin } from '@renderer/core/@typescript/components/Synchronizer/mixin';
import EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import CompilerBossTopPart from '@renderer/core/@typescript/prefabs/enemies/bosses/CompilerBossTopPart';
import CompilerBossRightPart from '@renderer/core/@typescript/prefabs/enemies/bosses/CompilerBossRightPart';
import CompilerBossBottomPart from '@renderer/core/@typescript/prefabs/enemies/bosses/CompilerBossBottomPart';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class CompilerBoss extends mix(EntityScript)
  .with(AttachedEntitiesMixin)
  .with(LocomotorMixin)
  .with(TransformMixin)
  .with(SynchronizerMixin) {
  public compilerBossTopPart: CompilerBossTopPart;

  public compilerBossBottomPart: CompilerBossBottomPart;

  public compilerBossRightPart: CompilerBossRightPart;

  constructor() {
    super();

    this.addTag('boss', 'alwaysVisible', 'staySpawned');

    // Locomotor
    this.components.locomotor.speedX = 90;
    this.bindPath(ComplexePath.fromSvgString(`M-200,${(Global.Game.canvasObj.height / 2) - 80}L${Global.Game.canvasObj.width - 240},${(Global.Game.canvasObj.height / 2) - 80}`), false);
    this.components.locomotor.canMove = true;

    // AttachedEntities
    this.compilerBossTopPart = new CompilerBossTopPart(this);
    this.compilerBossBottomPart = new CompilerBossBottomPart(this);
    this.compilerBossRightPart = new CompilerBossRightPart(this);
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

  getId(): string {
    return 'compilerboss';
  }

  splitVerticallySequence() {
    this.detachEntity(this.compilerBossBottomPart, 'bottom_part');
    this.bindPath(ComplexePath.fromSvgString(`M${this.components.transform.position.x},${this.components.transform.position.y}L${this.components.transform.position.x},48`), false);
    this.on('pathEnd', () => {
      this.components.synchronizer.syncEntity(this.compilerBossTopPart, { event: 'splitVerticallySequence' });
      this.components.synchronizer.syncEntity(this.compilerBossRightPart, { event: 'splitVerticallySequence' });
    }, { once: true });
  }

  splitedVerticallyVerticalScroll(direction: number = 1) {
    this.compilerBossBottomPart.splitedVerticallyVerticalScroll();
    this.bindPath(ComplexePath.fromSvgString(`M${direction * this.components.transform.position.x},${this.components.transform.position.y}L${direction * (this.components.transform.position.x - Global.Game.canvasObj.width + 240)},${this.components.transform.position.y}`), false);
    this.on('pathEnd', () => {
      this.components.synchronizer.syncEntity(this.compilerBossTopPart, { event: 'splitedVerticallyVerticalScroll' });
      this.components.synchronizer.syncEntity(this.compilerBossRightPart, { event: 'splitedVerticallyVerticalScroll' });
    }, { once: true });
  }
}
