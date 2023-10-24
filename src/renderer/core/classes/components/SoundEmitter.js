import Global from '@renderer/core/stores/AppStore';
import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';
import Cooldown from '@renderer/core/classes/components/Cooldown';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class SoundEmitter extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.currentSound = {};

    this.addComponent(Cooldown, SoundEmitter);

    /**
     * @param {String} soundPath
     */
    AddClassMethod(this.clazz, 'playSound', function (soundPath) {
      if (!this.components.soundemitter.cooldownActive()) {
        this.components.soundemitter.currentSound[soundPath] = Global.Sounds.play(soundPath);
        this.components.soundemitter.startCooldown();
      }
      return this.components.soundemitter.currentSound[soundPath];
    });

    /**
     * @param {String} soundPath
     */
    AddClassMethod(this.clazz, 'stopCurrentSound', function (soundPath) {
      if (this.components.soundemitter.currentSound[soundPath]) {
        this.components.soundemitter.currentSound[soundPath].pause();
        delete this.components.soundemitter.currentSound[soundPath];
      }
    });

    /**
     * @param {Number} time
     */
    AddClassMethod(this.clazz, 'setSoundCooldown', function (time) {
      this.components.soundemitter.setCooldown(time);
    });
  }
}
