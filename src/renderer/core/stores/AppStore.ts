import Settings from '@renderer/core/Settings';
import type Game from '@renderer/core/Game';
import AssetStore from '@renderer/core/stores/AssetStore';
import SoundStore from '@renderer/core/stores/SoundStore';

import Engine from '@renderer/core/@typescript/Engine';
import Random from '@renderer/core/@typescript/Random';
import type GamepadsManager from '@renderer/core/@typescript/GamepadsManager';

class AppStore {
  public loaded: boolean = false;

  public Engine: Engine = new Engine();

  public Gamepads: GamepadsManager;

  public Assets: typeof AssetStore = AssetStore;

  public Sounds: typeof SoundStore = SoundStore;

  public Settings: typeof Settings = Settings;

  public Game: Game = null;

  public Random: Random = new Random();

  public devToolsOpen: boolean = false;
}

export default new AppStore();
