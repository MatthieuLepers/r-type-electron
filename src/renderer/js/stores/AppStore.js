import Engine from '../classes/Engine';
import AssetStore from './AssetStore';
import SoundStore from './SoundStore';
import Settings from '../Settings';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
class AppStore {
  /**
   * @constructor
   */
  constructor() {
    this.loaded = false;
    this.Engine = new Engine();
    this.Gamepads = null;
    this.Assets = AssetStore;
    this.Sounds = SoundStore;
    this.Settings = Settings;
    this.ModKnowledge = null;
    this.Game = null;
  }
}

export default new AppStore();
