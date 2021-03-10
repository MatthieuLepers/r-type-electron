import Class from './classes/Class';
import Controls from './datas/Controls';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
class Settings extends Class {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.debug = {
      drawPath: false,
      drawHitbox: false,
      drawCollisionDetectionArea: false,
      drawHealthBars: false,
    };
    this.audio = {
      fxEnabled: true,
      ambientEnabled: true,
    };
    this.controls = Controls;
  }
}

export default new Settings();
