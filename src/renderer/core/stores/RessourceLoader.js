import Class from '@renderer/core/classes/Class';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';
import Asset from '@renderer/core/classes/ressources/Asset';
import Sound from '@renderer/core/classes/ressources/Sound';
import RessourcesData from '@renderer/core/datas/Ressources';
import AssetStore from '@renderer/core/stores/AssetStore';
import SoundStore from '@renderer/core/stores/SoundStore';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
class RessourceLoader extends Class {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.$ressourcesData = RessourcesData;
    this.$total = 0;
    this.$loaded = [];
    this.assets = AssetStore;
    this.sounds = SoundStore;
    this.addComponent(EventEmitter, RessourceLoader);
  }

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

  /**
   * @param {Object} assetData
   */
  loadAsset(assetData) {
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

  /**
   * @param {Object} soundData
   */
  loadSound(soundData) {
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
