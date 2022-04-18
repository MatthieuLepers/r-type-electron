import Global from '../../stores/AppStore';
import PhysicEntityScript from './PhysicEntityScript';
import AttachedEntities from '../components/AttachedEntities';
import Shooter from '../components/Shooter';
import Cooldown from '../components/Cooldown';
import ModuleEjectFx from './fx/ModuleEjectFx';
import ComplexePath from '../paths/ComplexePath';
import ModuleBullet from './projectiles/ModuleBullet';

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
    this.releasable = true;
    this.target = null;
    this.side = null;
    this.damages = 1;

    this.addComponent(AttachedEntities, Module);
    this.addComponent(Shooter, Module);
    this.addComponent(Cooldown, Module);

    // Locomotor
    this.components.locomotor.speedX = 150;
    this.bindPath(ComplexePath.fromSvgString(`M -32 ${Global.Game.canvas.height / 2 - 16} L ${Global.Game.canvas.width / 5} ${Global.Game.canvas.height / 2 - 16}`), false);
    this.components.locomotor.canMove = true;

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
    this.components.physics.collideFn = (ent) => ((ent.hasTag('player') && !ent.hasTag('projectile') && !ent.hasTag('module')) || (ent.hasTag('enemy') && ent.hasTag('projectile') && !ent.hasTag('piercing')) || (ent.hasTag('enemy') && !ent.hasTag('projectile')) || ent.hasTag('neutral'));
    this.addCollisionTag('!projectile', '!isDead', '!item');

    // Shooter
    this.components.shooter.shootFn = this.shootFn.bind(this);
    this.components.shooter.automatic = false;
    this.components.shooter.setCooldown(90);

    this.callback = {
      trackPlayer: this.trackPlayer.bind(this),
      oncollide: (e) => {
        const ent = e.details.collider;
        if (ent.hasTag('player') && !ent.hasTag('projectile') && !ent.hasTag('module') && !ent.isEntityAttached('module') && !this.attached && !this.hasTag('attachCooldown')) {
          this.attach(ent);
        } else if (ent.hasTag('arborbable')) {
          this.emit('absorb', { entity: ent });
          if (ent.hasComponent('EventEmitter')) {
            ent.emit('absorbed', { absorber: this });
          }
        }
      },
    };

    this.on('pathEnd', this.callback.trackPlayer);
    this.on('collide', this.callback.oncollide);
    this.on('move', () => {
      if (this.target && this.target.isEntityAttached('module')) {
        this.target = Global.Game.getPlayerList().filter((player) => !player.isEntityAttached('module')).shift();
      }
    });
  }

  /**
   * @inheritdoc
   */
  getHitboxBounds() {
    return {
      x: this.components.transform.position.x,
      y: this.components.transform.position.y + ((this.tier === 0 && 8) || (this.tier === 1 && 5) || 2),
      width: this.getSprite().width,
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
    const playerToTrack = this.owner || this.target || this.getNearestPlayer() || null;

    this.target = playerToTrack;
    if (this.target && !this.target.hasTag('isDead')) {
      this.components.locomotor.speedX = 115;
      this.components.locomotor.track(this.target);
    }
  }

  /**
   * @param {PlayerShip} ship
   */
  attach(ship) {
    if (ship && !ship.isEntityAttached('module') && !this.attached) {
      this.releasable = true;
      this.owner = ship;
      this.owner.releasedModule = null;
      this.owner.attachEntity(this, 'module');
      this.side = (this.getSprite().centerOrigin.x > this.owner.getSprite().centerOrigin.x ? Module.SIDE_FRONT : Module.SIDE_BACK);
      this.playSound('module/module_attach');
      this.unBindPath();
      this.update();
      this.components.physics.collideFn = null;
      this.addCollisionTag('enemy', '!piercing');
      this.addTag('linked');
    }
  }

  call() {
    this.callback.trackPlayer();
  }

  release() {
    if (this.owner && this.owner.isEntityAttached('module') && this.attached && this.releasable) {
      this.releasable = false;
      this.getAttachedEntity(`${this.getId()}_eject`).update();
      this.owner.detachEntity(this, 'module');
      this.owner.releasedModule = this;
      this.owner = null;
      this.playSound('module/module_release');
      if (this.side === Module.SIDE_FRONT) {
        this.bindPath(ComplexePath.fromSvgString(`M ${this.components.transform.position.x + 5} ${this.components.transform.position.y} L ${Global.Game.canvas.width - this.getSprite().width} ${this.components.transform.position.y}`), false);
      } else {
        this.bindPath(ComplexePath.fromSvgString(`M ${this.components.transform.position.x - 5} ${this.components.transform.position.y} L 0 ${this.components.transform.position.y}`), false);
      }
      this.components.locomotor.trackedEntity = null;
      this.components.physics.collideFn = (ent) => ((ent.hasTag('player') && !ent.hasTag('projectile') && !ent.hasTag('module')) || (ent.hasTag('enemy') && ent.hasTag('projectile') && !ent.hasTag('piercing')) || (ent.hasTag('enemy') && !ent.hasTag('projectile')) || ent.hasTag('neutral'));
      this.removeCollisionTag('enemy', '!piercing');
      this.components.locomotor.speedX = 300;
      this.on('pathEnd', this.callback.trackPlayer);
      this.addTag('attachCooldown');
      window.setTimeout(() => this.removeTag('attachCooldown'), 100);
    }
  }

  callOrRelease() {
    if (this.owner && this.owner.isEntityAttached('module') && this.attached) {
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

    if (this.attached) {
      const owner = this.owner || this.target;
      this.setTransform(
        owner.components.transform.position.x + (this.side === Module.SIDE_FRONT ? owner.getSprite().width : -this.getSprite().width),
        owner.getSprite().centerOrigin.y - (this.getSprite().height / 2),
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
    const bullet = ModuleBullet.new(this, null, angle);
    bullet.spawn();
    this.emit('shoot', { projectile: bullet });
  }
}
