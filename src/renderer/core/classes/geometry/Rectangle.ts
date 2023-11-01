/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Rectangle {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public rotation = 0,
  ) {}

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#f00';
    ctx.stroke();
  }
}
