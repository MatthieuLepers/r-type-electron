import AbstractRessourceStore from '@renderer/core/stores/AbstractRessourceStore';
import type Sound from '@renderer/core/classes/ressources/Sound';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
class SoundStore extends AbstractRessourceStore<Sound> {
  play(soundPath: string): Sound | null {
    const sound = this.get(soundPath);
    sound?.play();
    return sound;
  }

  exists(soundPath: string): boolean {
    return this.get(soundPath) !== null;
  }
}

export default new SoundStore();
