import Global from '@renderer/core/stores/AppStore';
import AbstractCommand from '@renderer/core/datas/Commands/AbstractCommand';

export default class DebugDrawQuadTreeCommand extends AbstractCommand {
  execute() {
    if (this.args.length >= 1) {
      const parsedArgument = [1, 'true'].includes(this.args[0]);
      Global.Settings.debug.drawCollisionDetectionArea = parsedArgument;

      return `[set] drawQuadTree <${parsedArgument.toString()}>`;
    }
    return `[get] drawQuadTree <${Global.Settings.debug.drawCollisionDetectionArea.toString()}>`;
  }
}
