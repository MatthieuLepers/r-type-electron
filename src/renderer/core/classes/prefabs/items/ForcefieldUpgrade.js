import Global from '@renderer/core/stores/AppStore';
import Upgrade from '@renderer/core/classes/prefabs/items/Upgrade';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ForcefieldUpgrade extends Upgrade {
  /**
   * @param {EntityScript} dropper
   */
  constructor(dropper) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `forcefieldupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/forcefield'),
      animation: 'loop',
      loop: true,
    });
  }

  /**
   * @param {EntityScript} picker
   */
  onPicked(picker) {
    const forcefield = picker.getAttachedEntity(`${picker.getId()}_forcefield`);
    picker.components.health.addAbsorbtion(2);
    if (!forcefield.enabled) {
      forcefield.enable();
    }
  }
}
