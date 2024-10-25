import Global from '@renderer/core/stores/AppStore';
import AbstractCommand from '@renderer/core/datas/Commands/AbstractCommand';

export default class DebugDrawHealthBarsCommand extends AbstractCommand {
  execute(): string {
    if (this.args.length >= 1) {
      const parsedArgument = [1, 'true'].includes(this.args[0]);
      Global.Settings.debug.drawHealthBars = parsedArgument;

      return `[set] drawHealthBars <${parsedArgument.toString()}>`;
    }
    return `[get] drawHealthBars <${Global.Settings.debug.drawHealthBars.toString()}>`;
  }
}
