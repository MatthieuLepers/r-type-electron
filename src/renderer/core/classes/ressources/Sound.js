import AbstractRessource from '@renderer/core/classes/ressources/AbstractRessource';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Sound extends AbstractRessource {
  /**
   * @param {Audio} audio
   * @param {Object} data
   */
  constructor(audio, data) {
    super(data);
    this.audio = audio;
    this.child = null;

    this.init();
  }

  init() {
    const { volume, muted, autoplay, loop } = this.$data ?? {};
    this.audio.volume = volume ?? 1;
    this.audio.muted = muted ?? false;
    this.audio.autoplay = autoplay ?? false;
    this.audio.loop = loop ?? false;
  }

  /**
   * @return {this}
   */
  play() {
    this.audio.play();
    return this;
  }

  /**
   * @return {this}
   */
  pause() {
    this.audio.pause();
    if (this.child) {
      this.child.pause();
    }
    return this;
  }

  /**
   * @param {Sound} sound
   * @return {this}
   */
  playSoundOnEnd(sound) {
    this.audio.addEventListener('ended', () => sound.play());
    this.child = sound;
    return sound;
  }

  /**
   * @return {Sound}
   */
  clone() {
    return new Sound(this.audio.cloneNode(true), this.$data);
  }
}
