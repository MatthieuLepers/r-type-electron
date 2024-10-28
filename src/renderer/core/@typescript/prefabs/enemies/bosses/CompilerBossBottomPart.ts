import Global from '@renderer/core/stores/AppStore';

import Enemy from '@renderer/core/@typescript/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import type CompilerBoss from '@renderer/core/@typescript/prefabs/enemies/bosses/CompilerBoss';
import CompilerBossTurret from '@renderer/core/@typescript/prefabs/enemies/bosses/CompilerBossTurret';
import Point from '@renderer/core/@typescript/geometry/Point';
import RectangleHitbox from '@renderer/core/@typescript/hitboxes/RectangleHitbox';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';

export default class CompilerBottomPart extends Enemy {
  constructor(public owner: CompilerBoss) {
    super();
    this.score = 5000;

    this.addTag('boss', 'alwaysVisible', 'staySpawned');

    // Locomotor
    this.components.locomotor.speedX = this.owner.components.locomotor.speed.x;
    this.components.locomotor.canMove = this.owner.components.locomotor.canMove;

    // Transform
    this.setTransform(this.owner.components.transform.position.x + 30, this.owner.components.transform.position.y + 6);

    // AttachedEntities
    this.attachEntity(new CompilerBossTurret(this, 'top', new Point(5, 47.5)), 'compilerboss_turrettop');
    this.attachEntity(new CompilerBossTurret(this, 'bottom', new Point(13, 71.5)), 'compilerboss_turretbottom');

    // Sprite
    this.components.sprite.init({
      id: `compilerbossbottom${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/bosses/compiler_bottom_part'),
      animation: 'loop',
      loop: true,
      animationDelay: 6,
    });

    // Health
    this.components.health.setMaxHealth(150);
    this.components.health.healthBarVisible = true;

    // Physics
    this.addCollisionTag('player', '!isDead');

    this.on('dead', () => {
      this.playSound('fx/entity/explosion_big');
      Explosion.EXPLOSION_BIG(this).spawn();
    });
    this.on('damaged', () => this.playSound('fx/entity/hull_hit'));
    this.on('detached', () => {
      this.splitVerticallySequence();
    }, { once: true });
  }

  getHitbox() {
    return [
      new RectangleHitbox({
        x: this.components.transform.position.x,
        y: this.components.transform.position.y,
        width: 48,
        height: 32,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x,
        y: this.components.transform.position.y + 32,
        width: this.components.sprite.width,
        height: this.components.sprite.height - 32,
      }, { hull: true }),
      new RectangleHitbox({
        x: this.components.transform.position.x + 54,
        y: this.components.transform.position.y + 16,
        width: 36,
        height: 16,
      }),
    ];
  }

  splitVerticallySequence() {
    this.bindPath(ComplexePath.fromSvgString(`M${this.components.transform.position.x},${this.components.transform.position.y}L${this.components.transform.position.x},${this.components.transform.position.y + Global.Game.canvasObj.height - this.components.sprite.height - 68}`), false);
    this.on('pathEnd', () => {
      this.owner.components.synchronizer.syncEntity(this, { event: 'splitVerticallySequence' });
    }, { once: true });
  }

  splitedVerticallyVerticalScroll(direction: number = 1) {
    this.bindPath(ComplexePath.fromSvgString(`M${direction * this.components.transform.position.x},${this.components.transform.position.y}L${direction * (this.components.transform.position.x - Global.Game.canvasObj.width + 240)},${this.components.transform.position.y}`), false);
    this.on('pathEnd', () => {
      this.owner.components.synchronizer.syncEntity(this, { event: 'splitedVerticallyVerticalScroll' });
    }, { once: true });
  }
}
