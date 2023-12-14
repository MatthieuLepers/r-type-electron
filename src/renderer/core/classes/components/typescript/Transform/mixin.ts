import Global from '@renderer/core/stores/AppStore';
import Point from '@renderer/core/classes/geometry/Point';
import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import type PlayerShip from '@renderer/core/classes/prefabs/PlayerShip';
import type Transform from '@/renderer/core/classes/components/typescript/Transform';
import type { ITransform } from '@/renderer/core/classes/components/typescript/Transform/i';

export const TransformMixin = (superclass: Constructor<Class>) => class extends superclass implements ITransform {
  declare components: {
    transform: Transform,
  };

  getDistanceTo(entity: TEntityScript): number {
    return this.components.transform.getPosition().getDistanceTo(entity.components.transform.getPosition());
  }

  getHorizontaleDistanceTo(entity: TEntityScript): number {
    return this.components.transform.getPosition().getHorizontaleDistanceTo(entity.components.transform.getPosition());
  }

  getVerticaleDistanceTo(entity: TEntityScript): number {
    return this.components.transform.getPosition().getVerticaleDistanceTo(entity.components.transform.getPosition());
  }

  getAngleTo(entity: TEntityScript): number {
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
