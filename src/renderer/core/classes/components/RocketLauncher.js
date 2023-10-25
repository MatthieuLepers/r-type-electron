import Component from '@renderer/core/classes/components/Component';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import Rocket from '@renderer/core/classes/prefabs/projectiles/Rocket';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class RocketLauncher extends Component {
  constructor(inst, clazz) {
    super(inst, clazz);

    this.addComponent(Cooldown, RocketLauncher);
    this.setCooldown(2000);
  }

  task() {
    if (!this.cooldownActive() && !this.inst.hasTag('dead')) {
      Rocket.new(this.inst, 'top').spawn();
      Rocket.new(this.inst, 'bottom').spawn();
      this.startCooldown();
    }
  }
}
