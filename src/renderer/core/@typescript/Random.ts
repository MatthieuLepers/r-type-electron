export interface IWeightedObject {
  weight: number;
}

export default class Random {
  public seed: number;

  constructor(baseSeed: number = 6) {
    this.seed = baseSeed;
  }

  rnd(max = 1, min = 0): number {
    this.seed = ((this.seed * 9301) + 49297) % 233280;
    return min + ((this.seed / 233280) * (max - min));
  }

  weighted(weightedObjList: Array<IWeightedObject> = []): IWeightedObject {
    const weightList = weightedObjList.map(({ weight }) => weight);
    const weightSum = weightList.reduce((sum, w) => sum + w);
    let choice = this.rnd(weightSum);
    let idx = weightList.length - 1;

    while ((choice - weightList[idx]) > 0) {
      choice -= weightList[idx];
      idx -= 1;
    }
    return weightedObjList[idx];
  }
}
