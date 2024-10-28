export default {
  bank: 'particles/fx/booster',
  spritesheetPath: '/public/img/spritesheets/particles/booster.png',
  animationData: {
    totalFrames: 5,
    animations: [
      {
        name: 'loop',
        frames: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
          { index: 1 },
        ],
      },
      {
        name: 'loop_end',
        frames: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
          { index: 3 },
          { index: 4 },
        ],
      },
      {
        name: 'boost',
        frames: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
          { index: 3 },
          { index: 4 },
          { index: 5 },
        ],
      },
    ],
  },
};
