type Tree<T> = T | { [k: string]: Tree<T> };

export default abstract class AbstractRessourceStore<T> {
  public banks: Tree<T> = {};

  get(ressourcePath: string): T | null {
    const bankPath = ressourcePath.split('/');
    const ressourceName = bankPath.pop();

    if (ressourceName) {
      let currentBank = this.banks;
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
    return null;
  }

  setAt(bank: string, ressource: T) {
    const bankPath = bank.split('/');
    const ressourceName = bankPath.pop();

    if (ressourceName) {
      let currentBank = this.banks;
      bankPath.forEach((b) => {
        if (!currentBank[b]) {
          currentBank[b] = {};
        }

        currentBank = currentBank[b];
      });

      currentBank[ressourceName] = ressource;
    }
  }
}
