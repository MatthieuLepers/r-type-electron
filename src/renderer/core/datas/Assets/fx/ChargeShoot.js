export default {
  bank: 'particles/fx/charge_shoot',
  spritesheetPath: '/assets/img/spritesheets/particles/charge_shoot.png',
  animationData: {
    totalFrames: 4,
    animations: [
      { name: 'idle', frames: [{ index: 3 }] },
      {
        name: 'shoot',
        frames: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
          { index: 3 },
        ],
      },
    ],
  },
};
