export interface ISoundEmitter {
  playSound(soundPath: string): void;

  stopCurrentSound(soundPath: string): void;

  setSoundCooldown(time: number): void;
}
