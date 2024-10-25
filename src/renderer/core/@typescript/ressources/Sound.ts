import AbstractRessource from '@renderer/core/@typescript/ressources/AbstractRessource';
import Settings from '@renderer/core/Settings';

export interface ISoundData {
  bank: string;
  soundPath: string;
  options?: {
    loop?: boolean;
    muted?: boolean;
    autoplay?: boolean;
  },
}

export default class Sound extends AbstractRessource<ISoundData> {
  public child: Sound | null;

  constructor(
    public audio: HTMLAudioElement,
    data: ISoundData,
  ) {
    super(data);
    this.child = null;

    this.init();
  }

  init() {
    const { muted, autoplay, loop } = this.data?.options ?? {};
    this.audio.volume = this.settingsVolume;
    this.audio.muted = muted ?? false;
    this.audio.autoplay = autoplay ?? false;
    this.audio.loop = loop ?? false;
  }

  get settingsVolume(): number {
    const volume = this.data.bank.startsWith('fx')
      ? Settings.audio.fxVolume
      : Settings.audio.ambientVolume
    ;
    return volume / 100;
  }

  play(): Sound {
    this.audio.play();
    return this;
  }

  pause(): Sound {
    this.audio.pause();
    if (this.child) {
      this.child.pause();
    }
    return this;
  }

  playSoundOnEnd(sound: Sound): Sound {
    this.audio.addEventListener('ended', () => sound.play());
    this.child = sound;
    return sound;
  }

  clone(): Sound {
    return new Sound(this.audio.cloneNode(true) as HTMLAudioElement, this.data);
  }
}
