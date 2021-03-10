import Global from '../../stores/AppStore';
import { AddClassMethod } from '../../Utils';
import Component from './Component';
import Cooldown from './Cooldown';

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
      console.log(this.components.soundemitter.currentSound);
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
