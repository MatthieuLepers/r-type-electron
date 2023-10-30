import Global from '@renderer/core/stores/AppStore';
import PhysicEntityScript from '@renderer/core/classes/prefabs/PhysicEntityScript';
import Explosion from '@renderer/core/classes/prefabs/Explosion';
import AttachedEntities from '@renderer/core/classes/components/AttachedEntities';
import Controller from '@renderer/core/classes/components/Controller';
import Health from '@renderer/core/classes/components/Health';
import Shooter from '@renderer/core/classes/components/Shooter';
import ChargedShooter from '@renderer/core/classes/components/ChargedShooter';
import RocketLauncher from '@renderer/core/classes/components/RocketLauncher';
import ScoreBoard from '@renderer/core/classes/components/ScoreBoard';
import ShipBoosterFx from '@renderer/core/classes/prefabs/fx/ShipBoosterFx';
import ShipBulletEmitFx from '@renderer/core/classes/prefabs/fx/ShipBulletEmitFx';
import ShipBulletChargeFx from '@renderer/core/classes/prefabs/fx/ShipBulletChargeFx';
import ShipBulletChargeShootFx from '@renderer/core/classes/prefabs/fx/ShipBulletChargeShootFx';
import ForceFieldFx from '@renderer/core/classes/prefabs/fx/ForceFieldFx';
import ShipChargedBullet from '@renderer/core/classes/prefabs/projectiles/ShipChargedBullet';
import ShipBullet from '@renderer/core/classes/prefabs/projectiles/ShipBullet';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class PlayerShip extends PhysicEntityScript {
  /**
   * @constructor
   * @param {String} id
   */
  constructor(id) {
    super();
    this.speed = 200; // pixel/s
    this.maxSpeed = 400; // pixel/s
    this.damages = 1;
    this.releasedModule = null;
    this.addTag('player', 'alwaysVisible');

    this.addComponent(Controller, PlayerShip);
    this.addComponent(AttachedEntities, PlayerShip);
    this.addComponent(Health, PlayerShip);
    this.addComponent(Shooter, PlayerShip);
    this.addComponent(ChargedShooter, PlayerShip);
    this.addComponent(RocketLauncher, PlayerShip);
    this.addComponent(ScoreBoard, PlayerShip);

    // Transform
    this.setTransform(100, (Global.Game.canvas.height / 2) - 7.5);

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id,
      asset: Global.Assets.get('entities/player/blue'),
      animation: 'idle',
      position: this.components.locomotor.position,
    });

    // Controller
    this.components.controller
      .bindControl('UP', {
        onPress: () => { this.components.locomotor.speedY = -this.speed; this.move(); },
        onRelease: () => { this.components.locomotor.speedY = 0; },
      })
      .bindControl('DOWN', {
        onPress: () => { this.components.locomotor.speedY = this.speed; this.move(); },
        onRelease: () => { this.components.locomotor.speedY = 0; },
      })
      .bindControl('LEFT', {
        onPress: () => { this.components.locomotor.speedX = -this.speed; this.move(); },
        onRelease: () => { this.components.locomotor.speedX = 0; },
      })
      .bindControl('RIGHT', {
        onPress: () => { this.components.locomotor.speedX = this.speed; this.move(); },
        onRelease: () => { this.components.locomotor.speedX = 0; },
      })
      .bindControl('PAUSE', {
        onPress: () => {
          if (!Global.devToolsOpen) {
            Global.Engine.togglePause();
          }
        },
      })
      .bindControl('SHOOT', {
        onPress: () => { this.shoot(); },
        onRelease: () => { this.emit('shootEnd'); },
      })
      .bindControl('CHARGE', {
        onPress: () => { this.chargeStart(); },
        onRelease: () => { this.chargeStop(); },
      })
      .bindControl('MODULE', {
        onPress: () => { if (this.module) this.module.callOrRelease(); },
      })
      .bindControl('DEBUG_TOGGLE_DRAW_HITBOXES', {
        onPress: () => { Global.Settings.debug.drawHitbox = !Global.Settings.debug.drawHitbox; },
      })
      .bindControl('DEBUG_TOGGLE_DRAW_QUADTREE', {
        onPress: () => { Global.Settings.debug.drawCollisionDetectionArea = !Global.Settings.debug.drawCollisionDetectionArea; },
      })
      .bindControl('DEBUG_TOGGLE_DRAW_PATHLINES', {
        onPress: () => { Global.Settings.debug.drawPath = !Global.Settings.debug.drawPath; },
      })
      .bindControl('DEBUG_TOGGLE_DRAW_HEALTH_BARS', {
        onPress: () => { Global.Settings.debug.drawHealthBars = !Global.Settings.debug.drawHealthBars; },
      })
      .bindControl('DEV_TOOLS', {
        onPress: () => {
          Global.Game.emit('devTools', { enabled: !Global.devToolsOpen });
        },
      })
    ;
    this.components.controller.setType(Controller.TYPE_KEYBOARD).bind();
    // this.components.controller.setType(Controller.TYPE_GAMEPAD).bind();

    // AttachedEntities
    this.attachEntity(ShipBoosterFx.new(this));
    this.attachEntity(ShipBulletEmitFx.new(this));
    this.attachEntity(ShipBulletChargeFx.new(this));
    this.attachEntity(ShipBulletChargeShootFx.new(this));
    this.attachEntity(ForceFieldFx.new(this));

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.addCollisionTag('enemy', '!isDead');

    // Shooter
    this.components.shooter.shootFn = this.shootFn.bind(this);
    this.components.shooter.automatic = false;
    this.components.shooter.setCooldown(90);
    // this.components.shooter.setCooldown(20);
    // this.components.shooter.configureSpread(-45, 45, 9, 0);

    // ChargedShooter
    this.components.chargedshooter.setProjectile(ShipChargedBullet);
    this.components.chargedshooter.automatic = false;

    this.on('upControlStart', () => { if (!this.hasTag('isDead')) this.playAnimation('up'); });
    this.on('upControlStop', () => { if (!this.hasTag('isDead')) this.playAnimation('upReverse'); });
    this.on('downControlStart', () => { if (!this.hasTag('isDead')) this.playAnimation('down'); });
    this.on('downControlStop', () => { if (!this.hasTag('isDead')) this.playAnimation('downReverse'); });
    this.on('collide', this.onCollide.bind(this));
    this.on('dead', this.onDead.bind(this));
    this.on('shoot', this.onShoot.bind(this));
    this.on('chargeStart', this.onChargeStart.bind(this));
    this.on('chargeStop', this.onChargeStop.bind(this));
    this.on('despawn', () => { this.components.controller.unbind(); });
  }

  respawn() {
    const player = PlayerShip.new(this.getId()).spawn();
    player.playAnimation('invincible', true);
    player.addTag('invincible');
    this.emit('respawn', { player });

    window.setTimeout(() => {
      player.removeTag('invincible');
      player.playAnimation('idle');
    }, 5000);
  }

  /**
   * @return {Module|null}
   */
  get module() {
    return this.releasedModule || this.getAttachedEntity('module') || null;
  }

  /* ----- Events listeners ----- */
  /**
   * @param {Event} e
   */
  onCollide(e) {
    if (e.details.collider.hasTag('enemy')) {
      this.getAttacked(e.details.collider);
    }
  }

  /**
   * @param {Event} e
   */
  onDead(e) {
    this.setSoundCooldown(0);
    console.log(`Killed by ${e.details.killer.getId()}`);
    // Release module
    const module = this.releasedModule || this.getAttachedEntity('module') || null;
    if (module) {
      module.release();
      module.removeTag('linked');
      this.releasedModule.owner = null;
      this.releasedModule.target = null;
      this.releasedModule = null;
      module.owner = null;
      module.target = null;
    }

    // Drop both BitModule
    const bitModuleTop = this.getAttachedEntity('bitmodule_top') || null;
    const bitModuleBottom = this.getAttachedEntity('bitmodule_bottom') || null;
    if (bitModuleTop) {
      this.detachEntity(bitModuleTop, 'bitmodule_top');
    }
    if (bitModuleBottom) {
      this.detachEntity(bitModuleBottom, 'bitmodule_bottom');
    }

    // Kill charging sound
    if (this.components.chargedshooter.isCharging) {
      this.components.chargedshooter.isCharging = false;
      this.getAttachedEntity(`${this.getId()}_charging`).playAnimation('idle');
      this.stopCurrentSound('player/charge');
    }

    // Play explosion & respawn
    this.playSound('entity/explosion_player');
    Explosion.EXPLOSION_PLAYER(this).spawn().on('animOver', () => {
      this.respawn();
    });
  }

  onShoot() {
    this.getAttachedEntity(`${this.getId()}_emit`).update();
    this.getAttachedEntity(`${this.getId()}_emit`).playAnimation('shoot');
    if (this.releasedModule) {
      this.releasedModule.shoot();
    }
  }

  onChargeStart() {
    this.setSoundCooldown(0);
    this.getAttachedEntity(`${this.getId()}_charging`).update();
    this.getAttachedEntity(`${this.getId()}_charging`).playAnimation('loop', true);
    this.playSound('player/charge');
  }

  onChargeStop() {
    this.getAttachedEntity(`${this.getId()}_charging`).update();
    this.getAttachedEntity(`${this.getId()}_charging`).playAnimation('idle');
    this.getAttachedEntity(`${this.getId()}_chargeshoot`).update();
    this.getAttachedEntity(`${this.getId()}_chargeshoot`).playAnimation('shoot');
    this.stopCurrentSound('player/charge');
    this.playSound('player/shoot_charged');
  }

  /**
   * @param {EntityScript|null} target
   */
  shootFn(target) {
    let sound = '';
    const module = this.getAttachedEntity('module') || null;

    if (module && module.weapon && !module.cooldownActive()) {
      module.weapon.shoot(module);

      sound = `weapon/${module.weapon.type.toLowerCase()}`;
    }

    if (!module || !module.weapon) {
      this.setSoundCooldown(90);
      const bullet = ShipBullet.new(this, target);
      bullet.spawn();
      this.emit('shoot', { projectile: bullet });
      sound = 'player/shoot';
    }

    if (Global.Sounds.exists(sound)) {
      this.playSound(sound);
    }
  }
}
