import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class AbstractRessourceStore {
  /**
   * @constructor
   */
  constructor() {
    if (this.constructor.name === 'AbstractRessourceStore') {
      throw new AbstractClassError(this);
    }
    this.$banks = {};
  }

  /**
   * @param {String} ressourcePath
   * @return {Ressource}
   */
  get(ressourcePath) {
    const bankPath = ressourcePath.split('/');
    const ressourceName = bankPath.pop();

    let currentBank = this.$banks;
    for (let i = 0; i < bankPath.length; i += 1) {
      if (currentBank[bankPath[i]]) {
        currentBank = currentBank[bankPath[i]];
      } else {
        return null;
      }
    }

    if (!currentBank[ressourceName]) {
      return null;
    }

    return currentBank[ressourceName].clone();
  }

  /**
   * @param {String} bank
   * @param {Ressource} ressource
   */
  setAt(bank, ressource) {
    const bankPath = bank.split('/');
    const ressourceName = bankPath.pop();

    let currentBank = this.$banks;
    bankPath.forEach((b) => {
      if (!currentBank[b]) {
        currentBank[b] = {};
      }

      currentBank = currentBank[b];
    });

    currentBank[ressourceName] = ressource;
  }
}
