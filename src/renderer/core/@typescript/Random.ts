export interface IWeightedObject {
  weight: number;
}

export default class Random {
  rnd(max = 1, min = 0): number {
    return (Math.random() * (max - min)) + min;
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
