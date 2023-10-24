export default {
  bank: 'entities/player/green',
  spritesheetPath: '/assets/img/spritesheets/player/green.png',
  animationData: {
    totalFrames: 6,
    animations: [
      { name: 'idle', frames: [{ index: 2 }] },
      {
        name: 'invincible',
        frames: [
          { index: 2 },
          { index: 5 },
        ],
      },
      {
        name: 'down',
        frames: [
          { index: 2 },
          { index: 1 },
          { index: 0 },
        ],
      },
      {
        name: 'downReverse',
        frames: [
          { index: 0 },
          { index: 1 },
          { index: 2 },
        ],
      },
      {
        name: 'up',
        frames: [
          { index: 2 },
          { index: 3 },
          { index: 4 },
        ],
      },
      {
        name: 'upReverse',
        frames: [
          { index: 4 },
          { index: 3 },
          { index: 2 },
        ],
      },
    ],
  },
};
