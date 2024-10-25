import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import { ShooterMixin } from '@renderer/core/@typescript/components/Shooter/mixin';
import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import { AttachedEntitiesMixin } from '@renderer/core/@typescript/components/AttachedEntities/mixin';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import type Module from '@renderer/core/@typescript/prefabs/Module';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import DnaBullet, { Color } from '@renderer/core/@typescript/prefabs/projectiles/DnaBullet';

export enum Slot {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export default class BitModule extends mix(PhysicEntityScript)
  .with(ShooterMixin)
  .with(AttachedEntitiesMixin) {
  constructor(
    public owner: PlayerShip & IAttachedEntities,
    public slot: `${Slot}`,
  ) {
    super();
    this.addTag('module', 'bitModule', 'player', 'weapon', 'alwaysVisible', 'staySpawned');
    this.owner.attachEntity(this, `bitmodule_${this.slot}`);
    this.damages = 1;

    // Transform
    this.setTransform(
      this.owner.components.transform.position.x + 7.5,
      this.owner.components.transform.position.y + (this.slot === Slot.TOP ? -36 : 36),
    );

    // Locomotor
    this.components.locomotor.speedX = owner.components.locomotor.speedX;
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id: `${this.owner.getId()}_bitmodule_${this.slot}`,
      asset: Global.Assets.get('entities/module/bit_module'),
      animation: (this.slot === Slot.TOP ? 'loop' : 'loop_reverse'),
      loop: true,
    });

    // Physics
    this.addCollisionTag('enemy', '!projectile', '!isDead');

    // Shooter
    this.components.shooter.shootFn = () => {
      const module = this.owner.getAttachedEntity<Module>('module') ?? null;
      if (module.tier >= 1 && module.weapon?.type === 'DNA') {
        new DnaBullet(this, null, (this.slot === Slot.TOP ? Color.RED : Color.BLUE)).spawn();
      }
    };
    this.components.shooter.automatic = false;
    this.components.shooter.setCooldown(180);

    this.on('detached', () => {
      this.despawn();
    });
  }
}
