import Global from '@/assets/js/stores/AppStore';
import AbstractCommand from '../AbstractCommand';

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
