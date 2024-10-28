export default {
  bank: 'entities/module/bit_module',
  spritesheetPath: '/public/img/spritesheets/module/bit_module.png',
  animationData: {
    totalFrames: 12,
    animations: [
      {
        name: 'loop',
        frames: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
          { index: 3 },
          { index: 4 },
          { index: 5 },
          { index: 6 },
          { index: 7 },
          { index: 8 },
          { index: 9 },
          { index: 10 },
          { index: 11 },
        ],
      },
      {
        name: 'loop_reverse',
        frames: [
          { index: 11 },
          { index: 10 },
          { index: 9 },
          { index: 8 },
          { index: 7 },
          { index: 6 },
          { index: 5 },
          { index: 4 },
          { index: 3 },
          { index: 2 },
          { index: 1 },
          { index: 0 },
        ],
      },
    ],
  },
};
