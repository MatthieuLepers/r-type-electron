import Global from '@renderer/core/stores/AppStore';
import { AddClassMethod } from '@renderer/core/utils';
import Component from '@renderer/core/classes/components/Component';

export default class ScoreBoard extends Component {
  /**
   * @inhertidoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);

    /**
     * @param {Number} score
     */
    AddClassMethod(this.clazz, 'addScore', function (entity) {
      Global.Game.scoreboard.boards[this.getId()].score += entity.score;
      Global.Game.scoreboard.boards[this.getId()].stats.killed[entity.constructor.name] += 1;
    });

    this.inst.on('spawn', () => {
      Global.Game.scoreboard.registerEntity(this.inst);
    }, { once: true });
  }
}
