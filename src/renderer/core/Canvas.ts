import type DrawableComponent from '@renderer/core/@typescript/components/DrawableComponent';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import Rectangle from '@renderer/core/@typescript/geometry/Rectangle';

export interface ICanvasOptions {
  width: number;
  height: number;
}

export default class Canvas {
  public options: ICanvasOptions = {
    width: window.innerWidth,
    height: window.innerHeight - 80,
  };

  public ctx: CanvasRenderingContext2D;

  public drawables: Map<EntityScript, Array<DrawableComponent<any>>> = new Map();

  constructor(
    public canvas: HTMLCanvasElement,
    options?: ICanvasOptions,
  ) {
    Object.assign(this.options, options);
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.strokeStyle = '#f00';

    window.addEventListener('resize', () => {
      this.options.width = window.innerWidth;
      this.options.height = window.innerHeight;
      this.canvas.width = this.options.width;
      this.canvas.height = this.options.height;
    });
  }

  addDrawable(drawable: DrawableComponent<any>) {
    if (!this.drawables.get(drawable.inst)) {
      this.drawables.set(drawable.inst, []);
    }
    this.drawables.get(drawable.inst).push(drawable);
  }

  removeDrawables(entity: EntityScript) {
    if (this.drawables.has(entity)) {
      this.drawables.delete(entity);
    }
  }

  removeDrawable(drawable: DrawableComponent<any>) {
    if (this.drawables.has(drawable.inst)) {
      this.drawables.set(drawable.inst, this.drawables.get(drawable.inst).filter((d) => d !== drawable));
    }
  }

  get width(): number {
    return this.options.width;
  }

  get height(): number {
    return this.options.height;
  }

  getBounds(): Rectangle {
    return new Rectangle({
      x: 0,
      y: 0,
      width: this.options.width,
      height: this.options.height,
    });
  }

  clear(x?: number, y?: number, width?: number, height?: number) {
    this.ctx.clearRect(x ?? 0, y ?? 0, width ?? this.options.width, height ?? this.options.height);
  }

  render() {
    this.clear();
    [...this.drawables.values()]
      .reduce((acc, val) => [...acc, ...val], [])
      .sort((a, b) => a.priority - b.priority)
      .forEach((drawable) => { drawable.render(); })
    ;
  }

  fillText(txt: string, x: number, y: number, styles: Record<string, string> = {}) {
    this.ctx.font = `${styles.fontSize ?? 16}px ${styles.fontFamily ?? 'Calibri'}`;
    this.ctx.fillStyle = styles.color ?? '#000';
    this.ctx.textAlign = (styles.align ?? 'center') as CanvasTextAlign;
    this.ctx.fillText(txt, x, y);
  }
}
