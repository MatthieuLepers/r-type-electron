import Class from '../classes/Class';
import EventEmitter from '../classes/components/EventEmitter';
import Asset from '../classes/ressources/Asset';
import Sound from '../classes/ressources/Sound';
import RessourcesData from '../datas/Ressources';
import AssetStore from './AssetStore';
import SoundStore from './SoundStore';

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
    this.$loaded = 0;
    this.assets = AssetStore;
    this.sounds = SoundStore;
    this.addComponent(EventEmitter, RessourceLoader);
  }

  load() {
    this.emit('loadStart');
    const { Assets, Sounds } = this.$ressourcesData;
    this.$total = Object.keys(Assets || {}).length + Object.keys(Sounds || {}).length;
    Object.values(Assets || {}).forEach(this.loadAsset.bind(this));
    Object.values(Sounds || {}).forEach(this.loadSound.bind(this));
  }

  /**
   * @param {Object} assetData
   */
  loadAsset(assetData) {
    const img = new Image();
    img.onload = () => {
      const asset = new Asset(img, assetData);
      this.$loaded += 1;
      this.emit('ressourceLoad', { ressource: asset, percent: (this.$loaded * 100) / this.$total });
      this.assets.setAt(assetData.bank, asset);
      if (this.$loaded === this.$total) {
        this.emit('loadEnd');
      }
    };
    img.src = assetData.spritesheetPath;
  }

  /**
   * @param {Object} soundData
   */
  loadSound(soundData) {
    const audio = new Audio(soundData.soundPath);
    audio.addEventListener('canplay', () => {
      const sound = new Sound(audio, soundData);
      this.$loaded += 1;
      this.emit('ressourceLoad', { ressource: sound, percent: (this.$loaded * 100) / this.$total });
      this.sounds.setAt(soundData.bank, sound);
      if (this.$loaded === this.$total) {
        this.emit('loadEnd');
      }
    });
    audio.load();
  }
}

export default new RessourceLoader();
