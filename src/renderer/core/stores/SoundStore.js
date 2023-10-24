import AbstractRessourceStore from '@renderer/core/stores/AbstractRessourceStore';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
class SoundStore extends AbstractRessourceStore {
  /**
   * @param {String} soundPath
   * @return {Sound}
   */
  play(soundPath) {
    const sound = this.get(soundPath);
    sound.play();
    return sound;
  }

  /**
   * @param {String} soundPath
   * @return {Boolean}
   */
  exists(soundPath) {
    return this.get(soundPath) !== null;
  }
}

export default new SoundStore();
