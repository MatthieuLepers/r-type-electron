import RessourcesData from '@renderer/core/datas/Ressources';
import AssetStore from '@renderer/core/stores/AssetStore';
import SoundStore from '@renderer/core/stores/SoundStore';
import { mix } from '@renderer/core/@types/Mixable';

import Class from '@renderer/core/@typescript/Class';
import Asset, { type IAssetData } from '@renderer/core/@typescript/ressources/Asset';
import Sound, { type ISoundData } from '@renderer/core/@typescript/ressources/Sound';
import { EventEmitterMixin } from '@renderer/core/@typescript/components/EventEmitter/mixin';

class RessourceLoader extends mix(Class).with(EventEmitterMixin) {
  public $ressourcesData: typeof RessourcesData = RessourcesData;

  public $total: number = 0;

  public $loaded: Array<unknown> = [];

  public assets: typeof AssetStore = AssetStore;

  public sounds: typeof SoundStore = SoundStore;

  load() {
    this.emit('loadStart');
    const { Assets, Sounds } = this.$ressourcesData;
    this.$total = Object.keys(Assets ?? {}).length + Object.keys(Sounds ?? {}).length;

    Promise.allSettled([
      ...Object.values(Assets || {}).map(this.loadAsset.bind(this)),
      ...Object.values(Sounds || {}).map(this.loadSound.bind(this)),
    ]).then(() => {
      this.emit('loadEnd');
    });
  }

  loadAsset(assetData: IAssetData) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const asset = new Asset(img, assetData);
        if (!this.$loaded.includes(assetData.bank)) {
          this.$loaded.push(assetData.bank);
        }
        this.emit('ressourceLoad', { ressource: asset, percent: (this.$loaded.length * 100) / this.$total });
        this.assets.setAt(assetData.bank, asset);
        resolve(asset);
      };
      img.onerror = reject;
      img.src = assetData.spritesheetPath;
    });
  }

  loadSound(soundData: ISoundData) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(soundData.soundPath);
      ['canplay', 'suspend'].forEach((event) => {
        audio.addEventListener(event, () => {
          const sound = new Sound(audio, soundData);
          if (!this.$loaded.includes(soundData.bank)) {
            this.$loaded.push(soundData.bank);
          }
          this.emit('ressourceLoad', { ressource: sound, percent: (this.$loaded.length * 100) / this.$total });
          this.sounds.setAt(soundData.bank, sound);
          resolve(sound);
        });
      });

      ['error', 'stalled'].forEach((event) => {
        audio.addEventListener(event, reject);
      });
      audio.load();
    });
  }
}

export default new RessourceLoader();
