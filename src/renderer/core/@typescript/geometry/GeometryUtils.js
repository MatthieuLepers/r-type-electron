export const ConvexHull = (pointList) => {
  const points = pointList.slice();
  // eslint-disable-next-line no-nested-ternary
  points.sort((a, b) => ((a.x < b.x || a.y < b.y) ? -1 : ((a.x > b.x || a.y > b.y) ? 1 : 0)));

  if (points.length <= 1) {
    return points.slice();
  }

  const upperHull = [];
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) {
        upperHull.pop();
      } else {
        break;
      }
    }
    upperHull.push(p);
  }
  upperHull.pop();

  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i -= 1) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) {
        lowerHull.pop();
      } else {
        break;
      }
    }
    lowerHull.push(p);
  }
  lowerHull.pop();

  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
    return upperHull;
  }
  return upperHull.concat(lowerHull);
};

export const OldConvexHull = (pointList) => {
  const ordered = [pointList.shift()];
  const proximityFn = (a, b) => (a.y > b.y && 1) || (a.y < b.y && -1) || 0;

  while (pointList.length > 1) {
    const [last] = ordered.slice(-1);

    const [nextTop] = pointList.filter((pt) => pt.x === last.x && pt.y < last.y).sort(proximityFn);
    const [nextRight] = pointList.filter((pt) => pt.x > last.x && pt.y === last.y).sort(proximityFn);
    const [nextBottom] = pointList.filter((pt) => pt.x === last.x && pt.y > last.y).sort(proximityFn);
    const [nextLeft] = pointList.filter((pt) => pt.x < last.x && pt.y === last.y).sort(proximityFn);
    const nextPoint = nextTop || nextRight || nextBottom || nextLeft;

    ordered.push(nextPoint);
    pointList.splice(pointList.indexOf(nextPoint), 1);
  }

  return ordered.concat(pointList);
};
