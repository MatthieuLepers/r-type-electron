import Global from '@/assets/js/stores/AppStore';
import AbstractCommand from '../AbstractCommand';

export default class DebugDrawHealthBarsCommand extends AbstractCommand {
  execute() {
    if (this.args.length >= 1) {
      const parsedArgument = [1, 'true'].includes(this.args[0]);
      Global.Settings.debug.drawHealthBars = parsedArgument;

      return `[set] drawHealthBars <${parsedArgument.toString()}>`;
    }
    return `[get] drawHealthBars <${Global.Settings.debug.drawHealthBars.toString()}>`;
  }
}
