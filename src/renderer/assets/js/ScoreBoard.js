export default class ScoreBoard {
  /**
   * @constructor
   */
  constructor() {
    this.boards = {};
  }

  /**
   * @param {EntityScript} entity
   */
  registerEntity(entity) {
    if (!this.boards[entity.getId()]) {
      this.boards[entity.getId()] = {
        score: 0,
        stats: {
          killed: {},
        },
      };
    }
  }
}
