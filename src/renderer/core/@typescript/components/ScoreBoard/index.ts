import Global from '@renderer/core/stores/AppStore';
import Component from '@renderer/core/@typescript/components/Component';
import type PhysicEntityScript from '@renderer/core/@typescript/prefabs/PhysicEntityScript';

export default class ScoreBoard extends Component<PhysicEntityScript> {
  constructor(inst: PhysicEntityScript, clazz: Function) {
    super(inst, clazz);

    this.inst.on('spawn', () => {
      Global.Game.scoreboard.registerEntity(this.inst);
    }, { once: true });
  }
}
