export default {
  bank: 'entities/projectiles/dna_bullet',
  spritesheetPath: '/assets/img/spritesheets/projectiles/dna_bullet.png',
  animationData: {
    totalFrames: 8,
    animations: [
      {
        name: 'loop_blue',
        frames: [
          { index: 0 },
          { index: 1 },
        ],
      },
      {
        name: 'loop_red',
        frames: [
          { index: 2 },
          { index: 3 },
        ],
      },
      {
        name: 'loop_blue_reverse',
        frames: [
          { index: 4 },
          { index: 5 },
        ],
      },
      {
        name: 'loop_red_reverse',
        frames: [
          { index: 6 },
          { index: 7 },
        ],
      },
    ],
  },
};
