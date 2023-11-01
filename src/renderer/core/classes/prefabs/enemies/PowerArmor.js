import Global from '@renderer/core/stores/AppStore';
import Enemy from '@renderer/core/classes/prefabs/enemies/Enemy';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import LootDropper from '@renderer/core/classes/components/LootDropper';
import DnaUpgrade from '@renderer/core/classes/prefabs/items/DnaUpgrade';
// import LaserUpgrade from '@renderer/core/classes/prefabs/items/LaserUpgrade';
// import FireUpgrade from '@renderer/core/classes/prefabs/items/FireUpgrade';
// import RocketUpgrade from '@renderer/core/classes/prefabs/items/RocketUpgrade';
// import ForcefieldUpgrade from '@renderer/core/classes/prefabs/items/ForcefieldUpgrade';
import BitModuleUpgrade from '@renderer/core/classes/prefabs/items/BitModuleUpgrade';
// import SpeedUpgrade from '@renderer/core/classes/prefabs/items/SpeedUpgrade';
import Point from '@renderer/core/classes/geometry/Point';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';
import RectangleHitbox from '@renderer/core/classes/hitboxes/RectangleHitbox';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class PowerArmor extends Enemy {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.damages = 1;

    this.addComponent(LootDropper, PowerArmor);

    // Locomotor
    this.components.locomotor.speedX = 100;
    this.bindPath(ComplexePath.fromSvgString('M 600 600 C 350 0 400 1200 0 600').moveTo(new Point(Global.Game.canvas.width, Global.Game.canvas.height / 2)));
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `powarmor${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/enemies/powarmor'),
      animation: 'fly',
      loop: true,
    });

    // Health
    this.components.health.setMaxHealth(1);
    this.components.health.healthBarVisible = true;

    // Physics
    this.components.physics.hitboxType = RectangleHitbox;
    this.addCollisionTag('player', '!isDead');

    // LootDropper
    this.components.lootdropper.addLoot(DnaUpgrade, 0.2);
    // this.components.lootdropper.addLoot(LaserUpgrade, 0.2);
    // this.components.lootdropper.addLoot(FireUpgrade, 0.2);
    // this.components.lootdropper.addLoot(RocketUpgrade, 0.1);
    // this.components.lootdropper.addLoot(ForcefieldUpgrade, 0.1);
    this.components.lootdropper.addLoot(BitModuleUpgrade, 0.1);
    // this.components.lootdropper.addLoot(SpeedUpgrade, 0.1);

    this.on('dead', () => {
      this.playSound('fx/entity/explosion');
      Explosion.EXPLOSION_NORMAL(this).spawn();
      this.dropLoots();
    });
  }
}
