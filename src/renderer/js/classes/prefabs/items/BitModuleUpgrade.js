import Global from '../../../stores/AppStore';
import Upgrade from './Upgrade';
import BitModule from '../BitModule';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class BitModuleUpgrade extends Upgrade {
  /**
   * @constructor
   * @param {EntityScript} dropper
   */
  constructor(dropper) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `bitmoduleupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('entities/module/bit_module'),
      animation: 'loop',
      loop: true,
    });
  }

  /**
   * @param {EntityScript} picker
   */
  onPicked(picker) {
    if (!picker.isEntityAttached('bitmodule_top')) {
      const bitModuleTop = BitModule.new(picker, BitModule.SLOT_TOP);
      bitModuleTop.spawn();
    } else if (!picker.isEntityAttached('bitmodule_bottom')) {
      const bitModuleBottom = BitModule.new(picker, BitModule.SLOT_BOTTOM);
      bitModuleBottom.spawn();
    }
  }
}
