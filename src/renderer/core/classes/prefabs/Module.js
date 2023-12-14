import Global from '@renderer/core/stores/AppStore';
import PhysicEntityScript from '@renderer/core/classes/prefabs/PhysicEntityScript';
import AttachedEntities from '@renderer/core/classes/components/AttachedEntities';
import Shooter from '@renderer/core/classes/components/Shooter';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import ModuleEjectFx from '@renderer/core/classes/prefabs/fx/ModuleEjectFx';
import ComplexePath from '@renderer/core/classes/paths/ComplexePath';
import ModuleBullet from '@renderer/core/classes/prefabs/projectiles/ModuleBullet';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Module extends PhysicEntityScript {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.addTag('module', 'player', 'weapon', 'alwaysVisible', 'staySpawned');
    this.tier = 0;
    this.owner = null;
    this.weapon = null;
    this.target = null;
    this.side = null;
    this.damages = 1;

    this.callback = {
      trackPlayer: this.trackPlayer.bind(this),
      retargetFn: () => {
        const target = this.getNearestPlayer();

        return target && target.isEntityAttached('module')
          ? Global.Game.getPlayerList().filter((player) => !player.isEntityAttached('module')).shift()
          : target
        ;
      },
      oncollide: (e) => {
        const ent = e.details.collider;
        if (ent.hasTag('player', '!isDead', '!projectile', '!module', '!attached', '!attachCooldown') && !ent.isEntityAttached('module')) {
          this.attach(ent);
        } else if (ent.hasTag('absorbable')) {
          this.emit('absorb', { entity: ent });
          if (ent.hasComponent('EventEmitter')) {
            ent.emit('absorbed', { absorber: this });
          }
        }
      },
    };

    this.addComponent(AttachedEntities, Module);
    this.addComponent(Shooter, Module);
    this.addComponent(Cooldown, Module);

    // Locomotor
    this.components.locomotor.speedX = 150;
    this.bindPath(ComplexePath.fromSvgString(`M -32 ${Global.Game.canvas.height / 2 - 16} L ${Global.Game.canvas.width / 5} ${Global.Game.canvas.height / 2 - 16}`), false);
    this.components.locomotor.canMove = true;
    this.components.locomotor.retargetFn = this.callback.retargetFn;

    // Sprite
    this.components.sprite.init({
      id: `module${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/module/module_t0'),
      animation: 'loop',
      loop: true,
    });

    // AttachedEntities
    this.attachEntity(ModuleEjectFx.new(this));

    // Physics
    this.components.physics.collideFn = (ent) => ent.hasTag('player', '!projectile', '!module') || ent.hasTag('enemy', 'projectile', '!piercing') || ent.hasTag('enemy', '!projectile') || ent.hasTag('neutral');
    this.addCollisionTag('!projectile', '!isDead', '!item');
    this.removeCollisionTag('!invinsible');

    // Shooter
    this.components.shooter.shootFn = this.shootFn.bind(this);
    this.components.shooter.automatic = false;
    this.components.shooter.setCooldown(90);

    this.on('pathEnd', this.callback.trackPlayer);
    this.on('collide', this.callback.oncollide);
    this.on('trackerAquireNewTarget', (e) => {
      this.target = e.details.target;
    });
  }

  /**
   * @inheritdoc
   */
  getHitboxBounds() {
    return {
      x: this.components.transform.position.x,
      y: this.components.transform.position.y + ((this.tier === 0 && 8) || (this.tier === 1 && 5) || 2),
      width: this.components.sprite.width,
      height: 16 + this.tier * 6,
    };
  }

  /**
   * @return {String}
   */
  static get SIDE_FRONT() {
    return 'front';
  }

  /**
   * @return {String}
   */
  static get SIDE_BACK() {
    return 'back';
  }

  trackPlayer() {
    this.target = this.callback.retargetFn();
    if (this.target) {
      this.components.locomotor.speedX = 115;
      this.components.locomotor.track(this.target);
    }
  }

  /**
   * @param {PlayerShip} ship
   */
  attach(ship) {
    if (ship && !ship.isEntityAttached('module') && !this.hasTag('attached')) {
      this.addTag('attached', 'releasable');
      this.removeTag('tracking');
      this.owner = ship;
      this.owner.releasedModule = null;
      this.owner.attachEntity(this, 'module');
      this.side = (this.components.sprite.centerOrigin.x > this.owner.components.sprite.centerOrigin.x ? Module.SIDE_FRONT : Module.SIDE_BACK);
      this.playSound('fx/module/module_attach');
      this.unBindPath();
      this.update();
      this.components.physics.collideFn = null;
      this.addCollisionTag('enemy', '!piercing');
    }
  }

  call() {
    this.callback.trackPlayer();
  }

  release() {
    if (this.owner && this.owner.isEntityAttached('module') && this.hasTag('attached', 'releasable')) {
      this.getAttachedEntity(`${this.getId()}_eject`).update();
      this.owner.detachEntity(this, 'module');
      this.owner.releasedModule = this;
      this.owner = null;
      this.playSound('fx/module/module_release');
      if (this.side === Module.SIDE_FRONT) {
        this.bindPath(ComplexePath.fromSvgString(`M ${this.components.transform.position.x + 5} ${this.components.transform.position.y} L ${Global.Game.canvas.width - this.components.sprite.width} ${this.components.transform.position.y}`), false);
      } else {
        this.bindPath(ComplexePath.fromSvgString(`M ${this.components.transform.position.x - 5} ${this.components.transform.position.y} L 0 ${this.components.transform.position.y}`), false);
      }
      this.components.locomotor.trackedEntity = null;
      this.components.physics.collideFn = (ent) => ent.hasTag('player', '!projectile', '!module') || ent.hasTag('enemy', 'projectile', '!piercing') || ent.hasTag('enemy', '!projectile') || ent.hasTag('neutral');
      this.removeCollisionTag('enemy', '!piercing');
      this.components.locomotor.speedX = 300;
      this.on('pathEnd', this.callback.trackPlayer);
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
    this.update(false);
  }

  /**
   * @param {Boolean} updatePosition
   */
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
        owner.components.transform.position.x + (this.side === Module.SIDE_FRONT ? owner.components.sprite.width : -this.components.sprite.width),
        owner.components.sprite.centerOrigin.y - (this.components.sprite.height / 2),
      );
    }
  }

  shootFn() {
    const sideOffset = (this.side === Module.SIDE_BACK ? 180 : 0);
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

  /**
   * @param {Number} angle
   */
  spawnBullet(angle) {
    const bullet = ModuleBullet.new(this.owner ?? this, null, angle);
    bullet.spawn();
    this.emit('shoot', { projectile: bullet });
  }
}
