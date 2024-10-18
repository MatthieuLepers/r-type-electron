import Global from '@renderer/core/stores/AppStore';
import DrawableComponent from '@renderer/core/classes/components/DrawableComponent';

export default class Debug extends DrawableComponent {
  constructor(inst, clazz) {
    super(inst, clazz);

    this.inst.on('spawn', () => {
      api.invoke('sendDataToWindow', 'devTools', 'onEntitySpawn', JSON.stringify(this.inst.toDebugObject()));

      if (this.inst.hasComponent('Sprite')) {
        api.on(this.inst.getId(), (actions) => {
          actions.forEach(({ callback, args }) => {
            if (this.inst[callback]) {
              this.inst[callback](...args);
            }
          });
        });
      }
    });

    this.inst.on('despawn', () => {
      api.invoke('sendDataToWindow', 'devTools', 'onEntityDespawn', this.inst.getId());
    });
  }

  render() {
    if (this.inst.hasTag('debug')) {
      if (this.inst.hasComponent('Sprite') && this.inst.hasComponent('Transform')) {
        const { sprite, transform } = this.inst.components;
        if (sprite.options.rotation !== 0) {
          Global.Game.ctx.save();
          if (sprite.options.origin.x !== 0 || sprite.options.origin.y !== 0) {
            Global.Game.ctx.translate(transform.getPosition().x + sprite.options.origin.x, transform.getPosition().y + sprite.options.origin.y);
          } else {
            Global.Game.ctx.translate(sprite.centerOrigin.x, sprite.centerOrigin.y);
          }
          Global.Game.ctx.rotate((sprite.options.rotation * Math.PI) / 180);
        }
        Global.Game.ctx.strokeStyle = '#fa00fa';
        Global.Game.ctx.strokeRect(
          (sprite.options.rotation !== 0 ? -sprite.rotationOrigin.x : transform.getPosition().x),
          (sprite.options.rotation !== 0 ? -sprite.rotationOrigin.y : transform.getPosition().y),
          sprite.width,
          sprite.height,
        );
        if (sprite.options.rotation !== 0) {
          Global.Game.ctx.restore();
        }
      }

      if (this.inst.hasTag('debug-path') && this.inst.hasComponent('Locomotor') && this.inst.components.locomotor.path) {
        this.inst.components.locomotor.path.debugDraw(Global.Game.ctx, '#fa00fa');
      }
    }
  }
}
