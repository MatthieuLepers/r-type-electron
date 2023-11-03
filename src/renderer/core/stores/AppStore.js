import Engine from '@renderer/core/classes/Engine';
import AssetStore from '@renderer/core/stores/AssetStore';
import SoundStore from '@renderer/core/stores/SoundStore';
import Settings from '@renderer/core/Settings';
import Random from '@renderer/core/classes/Random';

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
    this.Random = new Random();
    this.devToolsOpen = false;
  }
}

export default new AppStore();
