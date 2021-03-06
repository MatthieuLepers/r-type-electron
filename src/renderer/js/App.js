import Global from './stores/AppStore';
import GamepadsManager from './classes/GamepadsManager';
import RessourceLoader from './stores/RessourceLoader';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class App {
  /**
   * @constructor
   */
  constructor() {
    Global.Engine.start();
    Global.Gamepads = new GamepadsManager();
  }

  /**
   * @return {this}
   */
  async loadRessources() {
    RessourceLoader.load();
    await new Promise((resolve) => { RessourceLoader.on('loadEnd', resolve); });
    Global.Assets = RessourceLoader.assets;
    Global.Sounds = RessourceLoader.sounds;
    return this;
  }
}
