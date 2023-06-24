import Path from '@/assets/js/classes/paths/Path';
import Point from '@/assets/js/classes/geometry/Point';

describe('classes/paths/Path', () => {
  const origin = new Point(0, 0);
  const testing = new Path(new Point(100, 0));

  it('fromSvgString', () => {
    expect(Path.fromSvgString('M 100 0', origin)).toEqual(testing);
    expect(Path.fromSvgString('M 100,0', origin)).toEqual(testing);
    expect(Path.fromSvgString('M100,0', origin)).toEqual(testing);
    expect(Path.fromSvgString('M100 0', origin)).toEqual(testing);
    expect(() => Path.fromSvgString('M, 100 100', origin)).toThrow('Unable to parse SVG path from string \'M, 100 100\'');
  });

  it('toSvgPath', () => {
    expect(new Path(origin).toSvgPath()).toBe('M0,0');
  });

  it('rotate', () => {
    const expected = new Path(new Point(0, 100));
    expect(testing.rotate(90, origin)).toEqual(expected);
  });
});
