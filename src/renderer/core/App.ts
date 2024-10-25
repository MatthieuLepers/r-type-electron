import Global from '@renderer/core/stores/AppStore';
import RessourceLoader from '@renderer/core/stores/RessourceLoader';
import GamepadsManager from '@renderer/core/@typescript/GamepadsManager';

export default class App {
  constructor() {
    Global.Engine.start();
    Global.Gamepads = new GamepadsManager();
  }

  async loadRessources() {
    RessourceLoader.load();
    await new Promise((resolve) => { RessourceLoader.on('loadEnd', resolve); });
    Global.Assets = RessourceLoader.assets;
    Global.Sounds = RessourceLoader.sounds;
  }
}
