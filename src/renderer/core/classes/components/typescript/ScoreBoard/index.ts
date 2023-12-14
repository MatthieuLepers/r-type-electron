import Global from '@renderer/core/stores/AppStore';
import Component from '@renderer/core/classes/components/Component';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export default class ScoreBoard extends Component {
  declare inst: TEntityScript;

  constructor(inst: TEntityScript, clazz: Function) {
    super(inst, clazz);

    this.inst.on('spawn', () => {
      Global.Game.scoreboard.registerEntity(this.inst);
    }, { once: true });
  }
}
