import Global from '@renderer/core/stores/AppStore';
import EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import Sprite from '@renderer/core/classes/components/Sprite';
import Transform from '@renderer/core/classes/components/Transform';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Explosion extends EntityScript {
  /**
   * @constructor
   * @param {EntityScript} entity
   */
  constructor(entity) {
    super();

    this.addTag('explosion');

    this.addComponent(Transform, Explosion);
    this.addComponent(Sprite, Explosion);

    // Sprite
    this.components.sprite.init({
      id: `explosion_${entity.getId()}`,
      animation: 'explode',
    });
  }

  /**
   * @param {EntityScript} entity
   */
  static EXPLOSION_NORMAL(entity) {
    const explosion = Explosion.new(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 16,
      entity.components.sprite.centerOrigin.y - 16,
    );

    // Sprite
    explosion.components.sprite.init({ asset: Global.Assets.get('particles/explosion') });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  /**
   * @param {EntityScript} entity
   */
  static EXPLOSION_PLAYER(entity) {
    const explosion = Explosion.new(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 16,
      entity.components.sprite.centerOrigin.y - 14,
    );

    // Sprite
    explosion.components.sprite.init({ asset: Global.Assets.get('particles/explosion_player') });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  /**
   * @param {EntityScript} entity
   */
  static EXPLOSION_BIG(entity) {
    const explosion = Explosion.new(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 32,
      entity.components.sprite.centerOrigin.y - 32,
    );

    // Sprite
    explosion.components.sprite.init({ asset: Global.Assets.get('particles/explosion_big') });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  /**
   * @param {EntityScript} entity
   */
  static EXPLOSION_TINY(entity) {
    const explosion = Explosion.new(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 7.5,
      entity.components.sprite.centerOrigin.y - 7,
    );

    // Sprite
    explosion.components.sprite.init({ asset: Global.Assets.get('particles/explosion_tiny') });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  /**
   * @param {EntityScript} entity
   */
  static EXPLOSION_FIREBALL(entity) {
    const explosion = Explosion.new(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 16,
      entity.components.sprite.centerOrigin.y - 16,
    );

    // Sprite
    explosion.components.sprite.init({ asset: Global.Assets.get('particles/explosion_fireball') });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  /**
   * @param {EntityScript} entity
   */
  static EXPLOSION_DNA_BULLET(entity) {
    const explosion = Explosion.new(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 8,
      entity.components.sprite.centerOrigin.y - 7,
    );

    // Sprite
    explosion.components.sprite.init({ asset: Global.Assets.get('particles/explosion_dna_bullet') });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  /**
   * @param {EntityScript} entity
   */
  static EXPLOSION_BLUE_LASER(entity) {
    const explosion = Explosion.new(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 8,
      entity.components.sprite.centerOrigin.y - 8,
    );

    // Sprite
    explosion.components.sprite.init({ asset: Global.Assets.get('particles/explosion_blue_laser') });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }

  static EXPLOSION_ROCKET(entity) {
    const explosion = Explosion.new(entity);

    // Transform
    explosion.setTransform(
      entity.components.sprite.centerOrigin.x - 16,
      entity.components.sprite.centerOrigin.y - 16,
    );

    // Sprite
    explosion.components.sprite.init({ asset: Global.Assets.get('particles/explosion_rocket') });

    entity.despawn();
    explosion.on('animOver', () => explosion.despawn());
    return explosion;
  }
}
