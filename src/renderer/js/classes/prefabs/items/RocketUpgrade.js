import Global from '../../../stores/AppStore';
import Upgrade from './Upgrade';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class RocketUpgrade extends Upgrade {
  /**
   * @constructor
   * @param {EntityScript} dropper
   */
  constructor(dropper) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `rocketupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/rockets'),
      animation: 'loop',
      loop: true,
    });
  }

  /**
   * @param {EntityScript} picker
   */
  onPicked(picker) {
    console.log(`[WIP] Picked rocket upgrade by ${picker.getId()}`);
  }
}
