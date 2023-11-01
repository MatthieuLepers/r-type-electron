import Class from '@renderer/core/classes/Class';
import Controls from '@renderer/core/datas/Controls';

export interface IDebugSettings {
  drawPath: boolean;
  drawHitbox: boolean;
  drawCollisionDetectionArea: boolean;
  drawHealthBars: boolean;
}

export interface IAudioSettings {
  fxVolume: number;
  ambientVolume: number;
}

class Settings extends Class {
  public debug: IDebugSettings = {
    drawPath: false,
    drawHitbox: false,
    drawCollisionDetectionArea: false,
    drawHealthBars: false,
  };

  public audio: IAudioSettings = {
    fxVolume: 100,
    ambientVolume: 100,
  };

  public controls: typeof Controls = Controls;
}

export default new Settings();
