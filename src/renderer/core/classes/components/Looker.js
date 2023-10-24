import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Looker extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.target = null;
    this.minAngle = 0;
    this.maxAngle = 360;
    this.sweepCheck = false;

    /**
     * @param {EntityScript} target
     */
    AddClassMethod(this.clazz, 'setLookAt', function (target) {
      this.components.looker.target = target;
    });

    /**
     * @param {EntityScript} entity
     * @return {Boolean}
     */
    AddClassMethod(this.clazz, 'isLookingAt', function (entity) {
      const angle = Math.abs(Math.floor(this.getAngleTo(entity)));
      const rotation = Math.abs(Math.floor(this.components.sprite.options.rotation));
      return rotation === angle || rotation === 360 - angle;
    });
  }

  task() {
    if (this.target && this.inst.hasComponent('Sprite') && this.inst.hasComponent('Transform') && this.target.hasComponent('Transform')) {
      const signX = this.inst.getSprite().centerOrigin.x - this.target.getSprite().centerOrigin.x >= 0 ? -1 : 1;
      const signY = this.inst.getSprite().centerOrigin.y - this.target.getSprite().centerOrigin.y >= 0 ? -1 : 1;

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
