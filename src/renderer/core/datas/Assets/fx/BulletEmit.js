export default {
  bank: 'particles/fx/bullet_emit',
  spritesheetPath: '/assets/img/spritesheets/particles/bullet_emit.png',
  animationData: {
    totalFrames: 3,
    animations: [
      { name: 'idle', frames: [{ index: 2 }] },
      {
        name: 'shoot',
        frames: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
        ],
      },
    ],
  },
};
