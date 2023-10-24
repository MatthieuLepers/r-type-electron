import Global from '@renderer/core/stores/AppStore';
import AbstractCommand from '@renderer/core/datas/Commands/AbstractCommand';

export default class DebugDrawHitboxCommand extends AbstractCommand {
  execute() {
    if (this.args.length >= 1) {
      const parsedArgument = [1, 'true'].includes(this.args[0]);
      Global.Settings.debug.drawHitbox = parsedArgument;

      return `[set] drawHitbox <${parsedArgument.toString()}>`;
    }
    return `[get] drawHitbox <${Global.Settings.debug.drawHitbox.toString()}>`;
  }
}
