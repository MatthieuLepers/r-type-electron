import Global from '@/assets/js/stores/AppStore';
import AbstractCommand from '../AbstractCommand';

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
