import Global from '@renderer/core/stores/AppStore';

import DrawableComponent from '@renderer/core/@typescript/components/DrawableComponent';
import type { ISprite } from '@renderer/core/@typescript/components/Sprite/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export interface IAction {
  callback: string;
  args: any[];
}

export default class Debug extends DrawableComponent<EntityScript & ISprite> {
  constructor(inst: EntityScript & ISprite, clazz: Function) {
    super(inst, clazz);

    this.inst.on('spawn', () => {
      api.invoke('sendDataToWindow', 'devTools', 'onEntitySpawn', JSON.stringify(this.inst.toDebugObject()));

      if (this.inst.hasComponent('Sprite')) {
        api.on(this.inst.getId(), (actions: Array<IAction>) => {
          actions.forEach(({ callback, args }) => {
            if (this.inst[callback]) {
              this.inst[callback](...args);
            }
          });
        });
      }
    });

    this.inst.on('despawn', () => {
      if (this.inst.hasComponent('Sprite')) {
        api.invoke('sendDataToWindow', 'devTools', 'onEntityDespawn', this.inst.getId());
      }
    });
  }

  render() {
    if (this.inst.hasTag('debug') && this.inst.hasComponent('Sprite') && this.inst.hasComponent('Transform')) {
      const { sprite, transform } = this.inst.components;
      if (sprite.options.rotation !== 0) {
        Global.Game.ctx.save();
        if (sprite.options.origin.x !== 0 || sprite.options.origin.y !== 0) {
          Global.Game.ctx.translate(transform.getPosition().x + sprite.options.origin.x, transform.getPosition().y + sprite.options.origin.y);
        } else {
          Global.Game.ctx.translate(transform.getPosition().x, transform.getPosition().y);
        }
        Global.Game.ctx.rotate((sprite.options.rotation * Math.PI) / 180);
      }
      Global.Game.ctx.strokeStyle = '#f00';
      Global.Game.ctx.strokeRect(0, 0, sprite.width, sprite.height);
      if (sprite.options.rotation !== 0) {
        Global.Game.ctx.restore();
      }
    }
  }
}
