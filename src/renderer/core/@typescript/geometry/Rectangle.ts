export interface IRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export default class Rectangle {
  public x: number;

  public y: number;

  public width: number;

  public height: number;

  public rotation: number = 0;

  constructor({ x, y, width, height, rotation }: IRectangle) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = rotation ?? 0;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#f00';
    ctx.stroke();
  }
}
