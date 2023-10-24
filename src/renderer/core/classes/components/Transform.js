import { AddClassMethod } from '@renderer/core/utils';
import Global from '@renderer/core/stores/AppStore';
import Component from '@renderer/core/classes/components/Component';
import Point from '@renderer/core/classes/geometry/Point';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Transform extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz, Component.PRIORITY_LOW);
    this.$position = new Point(0, 0);
    this.calcPositionFn = null;

    /**
     * @param {EntityScript}
     * @return {Number}
     */
    AddClassMethod(this.clazz, 'getDistanceTo', function (entity) {
      return this.components.transform.getPosition().getDistanceTo(entity.components.transform.getPosition());
    });

    /**
     * @param {EntityScript}
     * @return {Number}
     */
    AddClassMethod(this.clazz, 'getHorizontaleDistanceTo', function (entity) {
      return this.components.transform.getPosition().getHorizontaleDistanceTo(entity.components.transform.getPosition());
    });

    /**
     * @param {EntityScript}
     * @return {Number}
     */
    AddClassMethod(this.clazz, 'getVerticaleDistanceTo', function (entity) {
      return this.components.transform.getPosition().getVerticaleDistanceTo(entity.components.transform.getPosition());
    });

    /**
     * @param {EntityScript}
     * @return {Number}
     */
    AddClassMethod(this.clazz, 'getAngleTo', function (entity) {
      return this.components.transform.getPosition().getAngleTo(entity.components.transform.getPosition());
    });

    /**
     * @param {Point} fromPosition
     * @return {PlayerShip}
     */
    AddClassMethod(this.clazz, 'getNearestPlayer', function () {
      const playerProximity = Global.Game.getPlayerList().map((player) => this.getDistanceTo(player));
      return Global.Game.getPlayerList()[playerProximity.indexOf(Math.min(...playerProximity))];
    });

    /**
     * @param {Number} x
     * @param {Number} y
     */
    AddClassMethod(this.clazz, 'setTransform', function (x, y) {
      this.components.transform.position = new Point(x, y);
    });

    /**
     * @param {Number} x
     */
    AddClassMethod(this.clazz, 'setTransformX', function (x) {
      this.components.transform.position.x = x;
    });

    /**
     * @param {Number} y
     */
    AddClassMethod(this.clazz, 'setTransformY', function (y) {
      this.components.transform.position.y = y;
    });
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  add(x, y) {
    this.position.add(x, y);
    if (this.inst.hasComponent('AttachedEntities')) {
      Object.values(this.inst.getAttachedEntities()).forEach((entity) => {
        entity.components.transform.add(x, y);
      });
    }
  }

  /**
   * @return {Point}
   */
  get position() {
    return this.$position;
  }

  /**
   * @param {Point}
   */
  set position(position) {
    this.$position = position;
  }

  /**
   * @return {Point}
   */
  getPosition() {
    return typeof this.calcPositionFn === 'function'
      ? this.calcPositionFn()
      : this.position
    ;
  }
}
