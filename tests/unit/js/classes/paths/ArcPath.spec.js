import ArcPath from '@/assets/js/classes/paths/ArcPath';
import Point from '@/assets/js/classes/geometry/Point';

describe('classes/paths/ArcPath', () => {
  const origin = new Point(0, 0);
  const testing = new ArcPath(origin, 10, 10, 0, true, false, new Point(100, 100));

  it('fromSvgString', () => {
    expect(ArcPath.fromSvgString('A 10 10 0 1 0 100 100', origin)).toEqual(testing);
    expect(ArcPath.fromSvgString('A 10,10,0,1,0,100,100', origin)).toEqual(testing);
    expect(ArcPath.fromSvgString('A10,10,0,1,0,100,100', origin)).toEqual(testing);
    expect(ArcPath.fromSvgString('A10 10 0 1 0 100 100', origin)).toEqual(testing);
    expect(() => ArcPath.fromSvgString('A, 10 0 1 0 100 100')).toThrowError('Unable to parse SVG path from string \'A, 10 0 1 0 100 100\'');
  });

  it('toSvgPath', () => {
    expect(testing.toSvgPath()).toBe('M0,0A10,10,0,1,0,100,100');
  });

  it('rotate', () => {
    const expected = new ArcPath(origin, 10, 10, 0, true, false, new Point(-100, 100));
    expect(testing.rotate(90, origin)).toEqual(expected);
  });
});
