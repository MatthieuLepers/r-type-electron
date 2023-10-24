export default {
  bank: 'particles/fx/module_eject',
  spritesheetPath: '/assets/img/spritesheets/particles/module_eject.png',
  animationData: {
    totalFrames: 9,
    animations: [
      { name: 'idle', frames: [{ index: 4 }] },
      {
        name: 'front',
        frames: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
          { index: 3 },
          { index: 4 },
        ],
      },
      {
        name: 'back',
        frames: [
          { index: 8 },
          { index: 7 },
          { index: 6 },
          { index: 5 },
          { index: 4 },
        ],
      },
    ],
  },
};
