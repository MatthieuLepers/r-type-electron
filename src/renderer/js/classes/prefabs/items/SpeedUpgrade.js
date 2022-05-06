import Global from '../../../stores/AppStore';
import Upgrade from './Upgrade';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class SpeedUpgrade extends Upgrade {
  /**
   * @constructor
   * @param {EntityScript} dropper
   */
  constructor(dropper) {
    super(dropper);
    this.speedMult = 1.25; // +25% speed

    // Sprite
    this.components.sprite.init({
      id: `speedupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/speed'),
      animation: 'loop',
      loop: true,
    });
  }

  /**
   * @param {EntityScript} picker
   */
  onPicked(picker) {
    picker.speed = Math.min(picker.maxSpeed, picker.speed * this.speedMult);
    picker.getAttachedEntity(`${picker.getId()}_booster`).accelerate();
  }
}
