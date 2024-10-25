import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import { SpriteMixin } from '@renderer/core/@typescript/components/Sprite/mixin';
import { TransformMixin } from '@renderer/core/@typescript/components/Transform/mixin';
import EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export default class Explosion extends mix(EntityScript)
  .with(SpriteMixin)
  .with(TransformMixin) {
  constructor(entity: EntityScript & ISprite) {
    super();

    this.addTag('explosion');

    // Sprite
    this.components.sprite.init({
      id: `explosion_${entity.getId()}`,
      animation: 'explode',
    });
  }

  static EXPLOSION_NORMAL(entity: EntityScript & ISprite): Explosion {
    const explosion = new Explosion(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 16,
      entity.components.sprite.centerOrigin.y - 16,
    );

    // Sprite
    explosion.components.sprite.init({
      asset: Global.Assets.get('particles/explosion'),
    });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  static EXPLOSION_PLAYER(entity: EntityScript & ISprite): Explosion {
    const explosion = new Explosion(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 16,
      entity.components.sprite.centerOrigin.y - 14,
    );

    // Sprite
    explosion.components.sprite.init({
      asset: Global.Assets.get('particles/explosion_player'),
    });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  static EXPLOSION_BIG(entity: EntityScript & ISprite): Explosion {
    const explosion = new Explosion(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 32,
      entity.components.sprite.centerOrigin.y - 32,
    );

    // Sprite
    explosion.components.sprite.init({
      asset: Global.Assets.get('particles/explosion_big'),
    });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  static EXPLOSION_TINY(entity: EntityScript & ISprite): Explosion {
    const explosion = new Explosion(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 7.5,
      entity.components.sprite.centerOrigin.y - 7,
    );

    // Sprite
    explosion.components.sprite.init({
      asset: Global.Assets.get('particles/explosion_tiny'),
    });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  static EXPLOSION_FIREBALL(entity: EntityScript & ISprite): Explosion {
    const explosion = new Explosion(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 16,
      entity.components.sprite.centerOrigin.y - 16,
    );

    // Sprite
    explosion.components.sprite.init({
      asset: Global.Assets.get('particles/explosion_fireball'),
    });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  static EXPLOSION_DNA_BULLET(entity: EntityScript & ISprite): Explosion {
    const explosion = new Explosion(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 8,
      entity.components.sprite.centerOrigin.y - 7,
    );

    // Sprite
    explosion.components.sprite.init({
      asset: Global.Assets.get('particles/explosion_dna_bullet'),
    });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  static EXPLOSION_BLUE_LASER(entity: EntityScript & ISprite): Explosion {
    const explosion = new Explosion(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 8,
      entity.components.sprite.centerOrigin.y - 8,
    );

    // Sprite
    explosion.components.sprite.init({
      asset: Global.Assets.get('particles/explosion_blue_laser'),
    });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  static EXPLOSION_ROCKET(entity: EntityScript & ISprite): Explosion {
    const explosion = new Explosion(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 16,
      entity.components.sprite.centerOrigin.y - 16,
    );

    // Sprite
    explosion.components.sprite.init({
      asset: Global.Assets.get('particles/explosion_rocket'),
    });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }
}
