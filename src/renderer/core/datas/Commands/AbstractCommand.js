export default class AbstractCommand {
  /**
   * @constructor
   * @param {String} cmd
   * @param {String[]} args
   */
  constructor(cmd, ...args) {
    if (this.constructor.name === 'AbstractCommand') {
      throw new Error('Cannot instanciate abstract class \'AbstractCommand\'');
    }
    this.cmd = cmd;
    this.args = args ?? [];
  }

  execute() {
    throw new Error(`You must implement execute method in ${this.constructor.name} class!`);
  }
}
