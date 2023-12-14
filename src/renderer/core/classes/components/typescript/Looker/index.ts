import Component from '@renderer/core/classes/components/Component';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Looker extends Component {
  declare inst: TEntityScript;

  public target: TEntityScript | null = null;

  public minAngle: number = 0;

  public maxAngle: number = 360;

  public sweepCheck: boolean = false;

  task() {
    if (this.target && this.inst.hasComponent('Sprite') && this.inst.hasComponent('Transform') && this.target.hasComponent('Transform')) {
      const signX = this.inst.components.sprite.centerOrigin.x - this.target.components.sprite.centerOrigin.x >= 0 ? -1 : 1;
      const signY = this.inst.components.sprite.centerOrigin.y - this.target.components.sprite.centerOrigin.y >= 0 ? -1 : 1;

      const angle = this.inst.getAngleTo(this.target);
      const minNormalizedAngle = 0;
      const maxNormalizedAngle = this.sweepCheck ? this.minAngle + (360 - this.maxAngle) : this.maxAngle;
      const normalizedAngle = (angle + this.minAngle) % 360;
      const minMaxAngle = Math.min(maxNormalizedAngle, Math.max(minNormalizedAngle, normalizedAngle));
      const yMinMaxAngle = minMaxAngle === maxNormalizedAngle && signY >= 0 ? minNormalizedAngle : minMaxAngle;
      const xMinMaxAngle = signX >= 0 ? Math.min(maxNormalizedAngle, Math.max(minNormalizedAngle, (360 - maxNormalizedAngle) - normalizedAngle)) : yMinMaxAngle;
      this.inst.components.sprite.options.rotation = (xMinMaxAngle - this.minAngle) % 360;
    }
  }
}
