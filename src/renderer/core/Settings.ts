import Class from '@renderer/core/classes/Class';
import Controls from '@renderer/core/datas/Controls';

export interface IDebugSettings {
  drawPath: boolean;
  drawHitbox: boolean;
  drawCollisionDetectionArea: boolean;
  drawHealthBars: boolean;
}

export interface IAudioSettings {
  fxEnabled: boolean,
  ambientEnabled: boolean,
}

class Settings extends Class {
  public debug: IDebugSettings = {
    drawPath: false,
    drawHitbox: false,
    drawCollisionDetectionArea: false,
    drawHealthBars: false,
  };

  public audio: IAudioSettings = {
    fxEnabled: true,
    ambientEnabled: true,
  };

  public controls: typeof Controls = Controls;
}

export default new Settings();
