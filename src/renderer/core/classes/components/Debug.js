import Global from '@renderer/core/stores/AppStore';
import DrawableComponent from '@renderer/core/classes/components/DrawableComponent';

export default class Debug extends DrawableComponent {
  render() {
    if (this.inst.hasTag('debug') && this.inst.hasComponent('Sprite') && this.inst.hasComponent('Transform')) {
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
      Global.Game.ctx.strokeStyle = '#f00';
      Global.Game.ctx.strokeRect(transform.getPosition().x, transform.getPosition().y, sprite.width, sprite.height);
      if (sprite.options.rotation !== 0) {
        Global.Game.ctx.restore();
      }
    }
  }
}
