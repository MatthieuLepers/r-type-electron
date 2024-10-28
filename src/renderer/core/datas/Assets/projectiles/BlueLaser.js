export default {
  bank: 'entities/projectiles/blue_laser',
  spritesheetPath: '/public/img/spritesheets/projectiles/blue_laser.png',
  animationData: {
    totalFrames: 1,
    animations: [
      {
        name: 'launch_t1',
        frames: [
          { index: 0, width: 0 },
          { index: 0, width: 16 },
          { index: 0, width: 32 },
          { index: 0, width: 48 },
          { index: 0, width: 64 },
        ],
      },
      {
        name: 'launch_t2',
        frames: [
          { index: 0, width: 0 },
          { index: 0, width: 16 },
          { index: 0, width: 32 },
          { index: 0, width: 48 },
          { index: 0, width: 64 },
          { index: 0, width: 80 },
          { index: 0, width: 96 },
          { index: 0, width: 112 },
          { index: 0, width: 128 },
        ],
      },
      {
        name: 'absorb_t1',
        frames: [
          { index: 0, width: 64 },
          { index: 0, width: 48 },
          { index: 0, width: 32 },
          { index: 0, width: 16 },
          { index: 0, width: 0 },
        ],
      },
      {
        name: 'absorb_t2',
        frames: [
          { index: 0, width: 128 },
          { index: 0, width: 112 },
          { index: 0, width: 96 },
          { index: 0, width: 80 },
          { index: 0, width: 64 },
          { index: 0, width: 48 },
          { index: 0, width: 32 },
          { index: 0, width: 16 },
          { index: 0, width: 0 },
        ],
      },
    ],
  },
};
