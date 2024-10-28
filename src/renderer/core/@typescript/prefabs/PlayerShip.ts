import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import type { IEvent } from '@renderer/core/@typescript/Event';
import type { ICooldown } from '@renderer/core/@typescript/components/Cooldown/i';
import Controller from '@renderer/core/@typescript/components/Controller';
import { ControllerMixin } from '@renderer/core/@typescript/components/Controller/mixin';
import { AttachedEntitiesMixin } from '@renderer/core/@typescript/components/AttachedEntities/mixin';
import { HealthMixin } from '@renderer/core/@typescript/components/Health/mixin';
import type { IShooter } from '@renderer/core/@typescript/components/Shooter/i';
import { ShooterMixin } from '@renderer/core/@typescript/components/Shooter/mixin';
import { ChargedShooterMixin } from '@renderer/core/@typescript/components/ChargedShooter/mixin';
import { RocketLauncherMixin } from '@renderer/core/@typescript/components/RocketLauncher/mixin';
import { ScoreBoardMixin } from '@renderer/core/@typescript/components/ScoreBoard/mixin';
import PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';
import type Module from '@renderer/core/@typescript/prefabs/Module';
import type BitModule from '@renderer/core/@typescript/prefabs/BitModule';
import Explosion from '@renderer/core/@typescript/prefabs/Explosion';
import ShipBoosterFx from '@renderer/core/@typescript/prefabs/fx/ShipBoosterFx';
import ShipBulletEmitFx from '@renderer/core/@typescript/prefabs/fx/ShipBulletEmitFx';
import ShipBulletChargeFx from '@renderer/core/@typescript/prefabs/fx/ShipBulletChargeFx';
import ShipBulletChargeShootFx from '@renderer/core/@typescript/prefabs/fx/ShipBulletChargeShootFx';
import ForceFieldFx from '@renderer/core/@typescript/prefabs/fx/ForceFieldFx';
import ShipChargedBullet from '@renderer/core/@typescript/prefabs/projectiles/ShipChargedBullet';
import ShipBullet from '@renderer/core/@typescript/prefabs/projectiles/ShipBullet';

export default class PlayerShip extends mix(PhysicEntityScript)
  .with(ControllerMixin)
  .with(ShooterMixin)
  .with(AttachedEntitiesMixin)
  .with(HealthMixin)
  .with(ChargedShooterMixin)
  .with(RocketLauncherMixin)
  .with(ScoreBoardMixin) {
  public speed: number = 200; // pixel/s

  public maxSpeed: number = 400; // pixel/s

  public releasedModule?: Module & IShooter = null;

  public lives: number = 2;

  constructor(id: string) {
    super();
    this.damages = 1;
    this.addTag('player', 'alwaysVisible');

    // Transform
    this.setTransform(100, (Global.Game.canvas.height / 2) - 7.5);

    // Locomotor
    this.components.locomotor.canMove = true;

    // Sprite
    this.components.sprite.init({
      id,
      asset: Global.Assets.get('entities/player/blue'),
      animation: 'idle',
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
    this.components.controller.setType(Controller.TYPE_KEYBOARD);
    // this.components.controller.setType(Controller.TYPE_GAMEPAD);
    this.components.controller.bind();

    // AttachedEntities
    this.attachEntity(new ShipBoosterFx(this));
    this.attachEntity(new ShipBulletEmitFx(this));
    this.attachEntity(new ShipBulletChargeFx(this));
    this.attachEntity(new ShipBulletChargeShootFx(this));
    this.attachEntity(new ForceFieldFx(this));

    // Health
    this.components.health.setMaxHealth(1);

    // Physics
    this.addCollisionTag('enemy', '!isDead');

    // RocketLauncher
    this.components.rocketlauncher.enabled = true;

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
    const player = new PlayerShip(this.getId()).spawn() as PlayerShip;
    player.lives = this.lives;
    player.playAnimation('invincible', true);
    player.addTag('invincible');
    this.emit('respawn', { player });

    window.setTimeout(() => {
      player.removeTag('invincible');
      player.playAnimation('idle');
    }, 5000);
  }

  get module(): Module | null {
    return this.releasedModule || this.getAttachedEntity<Module>('module') || null;
  }

  /* ----- Events listeners ----- */
  onCollide(e: IEvent) {
    if (e.details.collider.hasTag('enemy')) {
      this.getAttacked(e.details.collider);
    }
  }

  onDead() {
    this.setSoundCooldown(0);
    // Release module
    this.module?.release();

    // Drop both BitModule
    const bitModuleTop = this.getAttachedEntity<BitModule>('bitmodule_top') || null;
    const bitModuleBottom = this.getAttachedEntity<BitModule>('bitmodule_bottom') || null;
    if (bitModuleTop) {
      this.detachEntity(bitModuleTop, 'bitmodule_top');
    }
    if (bitModuleBottom) {
      this.detachEntity(bitModuleBottom, 'bitmodule_bottom');
    }

    // Kill charging sound
    if (this.components.chargedshooter.isCharging) {
      this.components.chargedshooter.isCharging = false;
      this.getAttachedEntity<ShipBulletChargeFx>(`${this.getId()}_charging`).playAnimation('idle');
      this.stopCurrentSound('fx/player/charge');
    }

    // Play explosion & respawn
    this.playSound('fx/entity/explosion_player');
    this.lives -= 1;
    if (this.lives < 0) {
      Global.Game.emit('gameOver');
    }
    Explosion.EXPLOSION_PLAYER(this).spawn().on('animOver', () => {
      if (this.lives >= 0) {
        this.respawn();
      }
    });
  }

  onShoot() {
    this.getAttachedEntity<ShipBulletEmitFx>(`${this.getId()}_emit`).update();
    this.getAttachedEntity<ShipBulletEmitFx>(`${this.getId()}_emit`).playAnimation('shoot');
    if (this.releasedModule) {
      this.releasedModule.shoot();
    }
  }

  onChargeStart() {
    this.setSoundCooldown(0);
    this.getAttachedEntity<ShipBulletChargeFx>(`${this.getId()}_charging`).update();
    this.getAttachedEntity<ShipBulletChargeFx>(`${this.getId()}_charging`).playAnimation('loop', true);
    this.playSound('fx/player/charge');
  }

  onChargeStop() {
    this.getAttachedEntity<ShipBulletChargeFx>(`${this.getId()}_charging`).update();
    this.getAttachedEntity<ShipBulletChargeFx>(`${this.getId()}_charging`).playAnimation('idle');
    this.getAttachedEntity<ShipBulletChargeShootFx>(`${this.getId()}_chargeshoot`).update();
    this.getAttachedEntity<ShipBulletChargeShootFx>(`${this.getId()}_chargeshoot`).playAnimation('shoot');
    this.stopCurrentSound('fx/player/charge');
    this.playSound('fx/player/shoot_charged');
  }

  shootFn() {
    let sound = '';
    const module = this.getAttachedEntity<Module & ICooldown>('module') || null;

    if (module && module.weapon && !module.cooldownActive()) {
      module.weapon.shoot(module);

      sound = `fx/weapon/${module.weapon.type.toLowerCase()}`;
    }

    if (!module || !module.weapon) {
      this.setSoundCooldown(90);
      const bullet = new ShipBullet(this);
      bullet.spawn();
      this.emit('shoot', { projectile: bullet });
      sound = 'fx/player/shoot';
    }

    if (Global.Sounds.exists(sound)) {
      this.playSound(sound);
    }
  }
}
