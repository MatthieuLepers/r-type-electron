import Global from '@renderer/core/stores/AppStore';
import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import Transform from '@renderer/core/@typescript/components/Transform';
import type { ITransform } from '@renderer/core/@typescript/components/Transform/i';
import Point from '@renderer/core/@typescript/geometry/Point';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import type PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';

export const TransformMixin = <T extends AnyConstructor<Class>>(base : T) => class MyTransformMixin extends base implements ITransform {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Transform, MyTransformMixin);
  }

  getDistanceTo(entity: EntityScript): number {
    return this.components.transform.getPosition().getDistanceTo(entity.components.transform.getPosition());
  }

  getHorizontaleDistanceTo(entity: EntityScript): number {
    return this.components.transform.getPosition().getHorizontaleDistanceTo(entity.components.transform.getPosition());
  }

  getVerticaleDistanceTo(entity: EntityScript): number {
    return this.components.transform.getPosition().getVerticaleDistanceTo(entity.components.transform.getPosition());
  }

  getAngleTo(entity: EntityScript): number {
    return this.components.transform.getPosition().getAngleTo(entity.components.transform.getPosition());
  }

  getNearestPlayer(): PlayerShip | null {
    const playerProximity = Global.Game.getPlayerList().map((player) => this.getDistanceTo(player));
    return Global.Game.getPlayerList()[playerProximity.indexOf(Math.min(...playerProximity))];
  }

  setTransform(x: number, y: number) {
    this.components.transform.position = new Point(x, y);
  }

  setTransformX(x: number) {
    this.components.transform.position.x = x;
  }

  setTransformY(y: number) {
    this.components.transform.position.y = y;
  }
};
