export default {
  bank: 'particles/fx/charge_bullet',
  spritesheetPath: '/public/img/spritesheets/particles/charge_bullet.png',
  animationData: {
    totalFrames: 9,
    animations: [
      { name: 'idle', frames: [{ index: 8 }] },
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
        ],
      },
    ],
  },
};
