export default class Point {
  public x: number = 0;

  public y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(x = 0, y = 0): Point {
    this.x += x;
    this.y += y;
    return this;
  }

  scale(x = 1, y = 1): Point {
    this.x *= x;
    this.y *= y;
    return this;
  }

  getDistanceTo(point: Point): number {
    return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
  }

  getHorizontaleDistanceTo(point: Point): number {
    return Math.max(this.x, point.x) - Math.min(this.x, point.x);
  }

  getVerticaleDistanceTo(point: Point): number {
    return Math.max(this.y, point.y) - Math.min(this.y, point.y);
  }

  getAngleTo(point: Point): number {
    const signX = this.x - point.x >= 0 ? -1 : 1;
    const signY = this.y - point.y >= 0 ? -1 : 1;
    const angle = (Math.atan2(this.getVerticaleDistanceTo(point), this.getHorizontaleDistanceTo(point)) * 180) / Math.PI;
    return (signX >= 0 ? 180 + signY * angle : 360 - signY * angle) % 360;
  }

  clone(): Point {
    const { x, y } = this;
    return new Point(x, y);
  }

  delta(point: Point): Point {
    return new Point(point.x - this.x, point.y - this.y);
  }

  rotate(angle: number, pivot: Point): Point {
    const angleRad = (angle * Math.PI) / 180;
    const newX = parseFloat(((Math.cos(angleRad) * (this.x - pivot.x)) - (Math.sin(angleRad) * (this.y - pivot.y)) + pivot.x).toFixed(3));
    const newY = parseFloat(((Math.sin(angleRad) * (this.x - pivot.x)) + (Math.cos(angleRad) * (this.y - pivot.y)) + pivot.y).toFixed(3));

    this.x = newX;
    this.y = newY;

    return this;
  }

  placeOnGrid(gridX: number, gridY: number, deltaX = 0, deltaY = 0): Point {
    const newX = Math.floor(this.x / gridX) * gridX;
    const newY = Math.floor(this.y / gridY) * gridY;
    this.x = newX + deltaX;
    this.y = newY + deltaY;

    return this;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.x - 5, this.y - 5);
    ctx.lineTo(this.x + 5, this.y + 5);
    ctx.strokeStyle = '#f00';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x - 5, this.y + 5);
    ctx.lineTo(this.x + 5, this.y - 5);
    ctx.strokeStyle = '#f00';
    ctx.stroke();
  }
}
