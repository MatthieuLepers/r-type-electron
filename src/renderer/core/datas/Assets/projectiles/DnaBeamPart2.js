export default {
  bank: 'entities/projectiles/dna_beam_part2',
  spritesheetPath: '/assets/img/spritesheets/projectiles/dna_beam_part2.png',
  animationData: {
    totalFrames: 8,
    animations: [
      {
        name: 'launch_front',
        frames: [
          { index: 0, width: 64, height: 32 },
          { index: 1, width: 67, height: 32, x: 64, hitboxOffsetX: 8 },
          { index: 2, width: 75, height: 32, x: 131, hitboxOffsetX: 16 },
          { index: 3, width: 88, height: 32, x: 206, hitboxOffsetX: 26 },
          { index: 4, width: 96, height: 32, x: 294, hitboxOffsetX: 32 },
          { index: 5, width: 99, height: 32, x: 390, hitboxOffsetX: 40 },
          { index: 6, width: 107, height: 32, x: 489, hitboxOffsetX: 48 },
          { index: 7, width: 120, height: 32, x: 596, hitboxOffsetX: 59 },
        ],
      },
      {
        name: 'launch_back',
        frames: [
          { index: 0, width: 64, height: 32, y: 32 },
          { index: 1, width: 67, height: 32, x: 64, y: 32, hitboxOffsetX: 8 },
          { index: 2, width: 75, height: 32, x: 131, y: 32, hitboxOffsetX: 16 },
          { index: 3, width: 88, height: 32, x: 206, y: 32, hitboxOffsetX: 26 },
          { index: 4, width: 96, height: 32, x: 294, y: 32, hitboxOffsetX: 32 },
          { index: 5, width: 99, height: 32, x: 390, y: 32, hitboxOffsetX: 40 },
          { index: 6, width: 107, height: 32, x: 489, y: 32, hitboxOffsetX: 48 },
          { index: 7, width: 120, height: 32, x: 596, y: 32, hitboxOffsetX: 59 },
        ],
      },
    ],
  },
};
