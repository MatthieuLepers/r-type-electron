import Global from '@/assets/js/stores/AppStore';
import AbstractCommand from '../AbstractCommand';

export default class DebugDrawPathCommand extends AbstractCommand {
  execute() {
    if (this.args.length >= 1) {
      const parsedArgument = [1, 'true'].includes(this.args[0]);
      Global.Settings.debug.drawPath = parsedArgument;

      return `[set] drawPath: <${parsedArgument.toString()}>`;
    }
    return `[get] drawPath: <${Global.Settings.debug.drawPath.toString()}>`;
  }
}
