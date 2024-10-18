import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Cooldown extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.active = false;
    this.time = 0;
    this.$timer = null;

    /**
     * @return {boolean}
     */
    AddClassMethod(this.clazz, 'cooldownActive', function () {
      return this.components.cooldown.time > 0 && this.components.cooldown.active;
    });

    AddClassMethod(this.clazz, 'startCooldown', function () {
      this.components.cooldown.start();
    });

    AddClassMethod(this.clazz, 'resetCooldown', function () {
      this.components.cooldown.reset();
    });

    /**
     * @param {Number} time
     */
    AddClassMethod(this.clazz, 'setCooldown', function (time) {
      this.components.cooldown.time = time;
    });
  }

  start() {
    if (!this.active && this.time > 0) {
      this.active = true;
      window.setTimeout(() => this.reset(), this.time);
    }
  }

  reset() {
    this.active = false;
    if (this.$timer) {
      window.clearTimeout(this.$timer);
      this.$timer = null;
    }
  }

  toDebugObject() {
    return {
      active: this.active,
      time: this.time,
    };
  }
}
