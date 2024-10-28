import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import type { IEvent } from '@renderer/core/@typescript/Event';
import { AttachedEntitiesMixin } from '@renderer/core/@typescript/components/AttachedEntities/mixin';
import { ShooterMixin } from '@renderer/core/@typescript/components/Shooter/mixin';
import { CooldownMixin } from '@renderer/core/@typescript/components/Cooldown/mixin';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import ModuleEjectFx from '@renderer/core/@typescript/prefabs/fx/ModuleEjectFx';
import ModuleBullet from '@renderer/core/@typescript/prefabs/projectiles/ModuleBullet';
import type Weapon from '@renderer/core/@typescript/prefabs/items/weapons/Weapon';
import ComplexePath from '@renderer/core/@typescript/paths/ComplexePath';
import type { IRectangle } from '@renderer/core/@typescript/geometry/Rectangle';

export enum Side {
  FRONT = 'front',
  BACK = 'back',
}

export default class Module extends mix(PhysicEntityScript)
  .with(AttachedEntitiesMixin)
  .with(ShooterMixin)
  .with(CooldownMixin) {
  public tier: number = 0;

  public owner: PlayerShip;

  public weapon: Weapon;

  public target: PlayerShip;

  public side: `${Side}`;

  public absorbsionProgress: number = 0;

  declare attachedTo?: PlayerShip;

  constructor() {
    super();
    this.addTag('module', 'player', 'weapon', 'alwaysVisible', 'staySpawned');
    this.damages = 1;

    // Locomotor
    this.components.locomotor.speedX = 150;
    this.bindPath(ComplexePath.fromSvgString(`M -32 ${Global.Game.canvas.height / 2 - 16} L ${Global.Game.canvas.width / 5} ${Global.Game.canvas.height / 2 - 16}`), false);
    this.components.locomotor.canMove = true;
    this.components.locomotor.retargetFn = this.retargetFn.bind(this);

    // Sprite
    this.components.sprite.init({
      id: `module${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/module/module_t0'),
      animation: 'loop',
      loop: true,
    });

    // AttachedEntities
    this.attachEntity(new ModuleEjectFx(this));

    // Physics
    this.components.physics.collideFn = (ent) => ent.hasTag('player', '!projectile', '!module') || ent.hasTag('enemy', 'projectile', '!piercing') || ent.hasTag('enemy', '!projectile') || ent.hasTag('neutral');
    this.addCollisionTag('!projectile', '!isDead', '!item');
    this.removeCollisionTag('!invinsible');

    // Shooter
    this.components.shooter.shootFn = this.shootFn.bind(this);
    this.components.shooter.automatic = false;
    this.components.shooter.setCooldown(90);

    this.on('pathEnd', this.trackPlayer.bind(this));
    this.on('collide', this.onCollide.bind(this));
    this.on('trackerAquireNewTarget', (e: IEvent) => {
      this.target = e.details.target;
    });
    this.on('absorb', (e: IEvent) => {
      if (this.attachedTo) {
        this.attachedTo.incrementScore(e.details.entity);
        this.attachedTo.incrementStat('absorbed', e.details.entity);
      }
    });
  }

  getHitboxBounds(): IRectangle {
    return {
      x: this.components.transform.position.x,
      y: this.components.transform.position.y + ((this.tier === 0 && 8) || (this.tier === 1 && 5) || 2),
      width: this.components.sprite.width,
      height: 16 + this.tier * 6,
    };
  }

  trackPlayer() {
    this.target = this.retargetFn();
    if (this.target) {
      this.components.locomotor.speedX = 115;
      this.components.locomotor.track(this.target);
    }
  }

  retargetFn(): PlayerShip {
    const target = this.getNearestPlayer();

    return target && target.isEntityAttached('module')
      ? Global.Game.getPlayerList().filter((player) => !player.isEntityAttached('module')).shift()
      : target
    ;
  }

  onCollide(e: IEvent) {
    const ent = e.details.collider;
    if (ent.hasTag('player', '!isDead', '!projectile', '!module', '!attached', '!attachCooldown') && !ent.isEntityAttached('module')) {
      this.attach(ent);
    } else if (ent.hasTag('absorbable')) {
      this.emit('absorb', { entity: ent });
      this.onAbsorb();
      if (ent.hasComponent('EventEmitter')) {
        ent.emit('absorbed', { absorber: this });
      }
    }
  }

  onAbsorb() {
    if (this.hasTag('attached')) {
      this.absorbsionProgress = Math.min(100, this.absorbsionProgress + 2);
      this.emit('absorbsionProgress', { percent: this.absorbsionProgress });
      if (this.absorbsionProgress >= 100) {
        this.emit('absorbsionComplete');
      }
    }
  }

  attach(ship: PlayerShip) {
    if (ship && !ship.isEntityAttached('module') && !this.hasTag('attached')) {
      this.addTag('attached', 'releasable');
      this.removeTag('tracking');
      this.owner = ship;
      this.owner.releasedModule = null;
      this.owner.attachEntity(this, 'module');
      this.side = (this.components.sprite.centerOrigin.x > this.owner.components.sprite.centerOrigin.x ? Side.FRONT : Side.BACK);
      this.playSound('fx/module/module_attach');
      this.unBindPath();
      this.update();
      this.components.physics.collideFn = null;
      this.addCollisionTag('enemy', '!piercing');
    }
  }

  call() {
    this.trackPlayer();
  }

  release() {
    if (this.owner && this.owner.isEntityAttached('module') && this.hasTag('attached', 'releasable')) {
      this.getAttachedEntity<ModuleEjectFx>(`${this.getId()}_eject`).update();
      this.owner.detachEntity(this, 'module');
      this.owner.releasedModule = this;
      this.owner = null;
      this.target = null;
      this.playSound('fx/module/module_release');
      if (this.side === Side.FRONT) {
        this.bindPath(ComplexePath.fromSvgString(`M ${this.components.transform.position.x + 5} ${this.components.transform.position.y} L ${Global.Game.canvas.width - this.components.sprite.width} ${this.components.transform.position.y}`), false);
      } else {
        this.bindPath(ComplexePath.fromSvgString(`M ${this.components.transform.position.x - 5} ${this.components.transform.position.y} L 0 ${this.components.transform.position.y}`), false);
      }
      this.components.locomotor.trackedEntity = null;
      this.components.physics.collideFn = (ent) => ent.hasTag('player', '!projectile', '!module') || ent.hasTag('enemy', 'projectile', '!piercing') || ent.hasTag('enemy', '!projectile') || ent.hasTag('neutral');
      this.removeCollisionTag('enemy', '!piercing');
      this.components.locomotor.speedX = 300;
      this.on('pathEnd', this.trackPlayer.bind(this));
      this.addTag('attachCooldown');
      window.setTimeout(() => this.removeTag('attachCooldown'), 100);
      this.removeTag('attached', 'releasable');
    }
  }

  callOrRelease() {
    if (this.owner && this.owner.isEntityAttached('module') && this.hasTag('attached', 'releasable')) {
      this.release();
    } else {
      this.call();
    }
  }

  increaseTier() {
    this.tier = (this.tier + 1 > 2 ? 2 : this.tier + 1);
    this.update();
  }

  update() {
    if (this.tier === 1) {
      this.components.sprite.init({
        asset: Global.Assets.get(`entities/module/module_t1_${this.side}`),
      });
    } else if (this.tier === 2) {
      this.components.sprite.init({
        asset: Global.Assets.get('entities/module/module_t2'),
      });
    }

    if (this.hasTag('attached')) {
      const owner = this.owner || this.target;
      this.setTransform(
        owner.components.transform.position.x + (this.side === Side.FRONT ? owner.components.sprite.width : -this.components.sprite.width),
        owner.components.sprite.centerOrigin.y - (this.components.sprite.height / 2),
      );
    }
  }

  shootFn() {
    const sideOffset = (this.side === Side.BACK ? 180 : 0);
    switch (this.tier) {
      case 1:
        this.spawnBullet(35 + sideOffset);
        this.spawnBullet(-35 + sideOffset);
        break;
      case 2:
        this.spawnBullet(20);
        this.spawnBullet(-20);
        this.spawnBullet(85);
        this.spawnBullet(-85);
        break;
      default:
        this.spawnBullet(0);
    }
  }

  spawnBullet(angle: number) {
    const bullet = new ModuleBullet(this.owner ?? this, null, angle);
    bullet.spawn();
    this.emit('shoot', { projectile: bullet });
  }
}
