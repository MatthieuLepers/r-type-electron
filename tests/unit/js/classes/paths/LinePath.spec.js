import LinePath from '@/assets/js/classes/paths/LinePath';
import Point from '@/assets/js/classes/geometry/Point';

describe('classes/paths/LinePath', () => {
  const origin = new Point(0, 0);
  const testing = new LinePath(origin, new Point(100, 100));

  it('fromSvgString', () => {
    expect(LinePath.fromSvgString('L 100 100', origin)).toEqual(testing);
    expect(LinePath.fromSvgString('L 100,100', origin)).toEqual(testing);
    expect(LinePath.fromSvgString('L100,100', origin)).toEqual(testing);
    expect(LinePath.fromSvgString('L100 100', origin)).toEqual(testing);
    expect(() => LinePath.fromSvgString('L, 100 100', origin)).toThrowError('Unable to parse SVG path from string \'L, 100 100\'');
  });

  it('toSvgPath', () => {
    expect(testing.toSvgPath()).toBe('M0,0L100,100');
  });

  it('moveTo', () => {
    const expected = new LinePath(new Point(100, 0), new Point(200, 100));
    expect(testing.moveTo(new Point(100, 0))).toEqual(expected);
  });

  it('rotate', () => {
    const expected = new LinePath(new Point(0, 0), new Point(-100, 100));
    expect(testing.rotate(90, new Point(0, 0))).toEqual(expected);
  });
});
