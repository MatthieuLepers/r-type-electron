import Global from '../../../stores/AppStore';
import Upgrade from './Upgrade';
import Module from '../Module';
import LaserWeapon from './weapons/LaserWeapon';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class LaserUpgrade extends Upgrade {
  /**
   * @constructor
   * @param {EntityScript} dropper
   */
  constructor(dropper) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `laserupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/laser'),
      animation: 'loop',
      loop: true,
    });
  }

  /**
   * @param {EntityScript} picker
   */
  onPicked(picker) {
    let newModule = null;
    const moduleList = Global.Game.findEntitiesByTags('module', '!bitModule');
    if (moduleList.length < Global.Game.getPlayerList().length) {
      newModule = Module.new();
      newModule.spawn();
    }
    const module = picker.getAttachedEntity('module') ?? picker.releasedModule ?? Global.Game.findFirstEntityByTags('module', '!bitModule', '!linked', '!attached');
    if (module && module !== newModule) {
      module.increaseTier();
      module.weapon = LaserWeapon.new();
    }
  }
}
