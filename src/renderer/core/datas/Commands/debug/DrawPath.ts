import Global from '@renderer/core/stores/AppStore';
import AbstractCommand from '@renderer/core/datas/Commands/AbstractCommand';

export default class DebugDrawPathCommand extends AbstractCommand {
  execute(): string {
    if (this.args.length >= 1) {
      const parsedArgument = [1, 'true'].includes(this.args[0]);
      Global.Settings.debug.drawPath = parsedArgument;

      return `[set] drawPath: <${parsedArgument.toString()}>`;
    }
    return `[get] drawPath: <${Global.Settings.debug.drawPath.toString()}>`;
  }
}
