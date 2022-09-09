import Global from '../../../stores/AppStore';
import Upgrade from './Upgrade';
import Module from '../Module';
import FireWeapon from './weapons/FireWeapon';

export default class FireUpgrade extends Upgrade {
  /**
   * @constructor
   * @param {EntityScript} dropper
   */
  constructor(dropper) {
    super(dropper);

    // Sprite
    this.components.sprite.init({
      id: `fireupgrade${Global.Game.uniqid()}`,
      asset: Global.Assets.get('upgrades/fire'),
      animation: 'loop',
      loop: true,
    });
  }

  /**
   * @param {EntityScript} picker
   */
  onPicked(picker) {
    let newModule = null;
    const moduleList = Global.Game.findEntitiesByTags('module', '!bitModule', '!projectile');
    if (moduleList.length < Global.Game.getPlayerList().length) {
      newModule = Module.new();
      newModule.spawn();
    }
    const module = picker.getAttachedEntity('module') ?? picker.releasedModule ?? Global.Game.findFirstEntityByTags('module', '!bitModule', '!linked', '!attached');
    if (module && module !== newModule) {
      module.increaseTier();
      module.weapon = FireWeapon.new();
    }
  }
}
