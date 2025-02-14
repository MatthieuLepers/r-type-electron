export default class Runnable {
  public callback: ((frame?: number) => void) | null;

  constructor(
    public name: string,
    callback: ((frame?: number) => void) | null = null,
    public canRunInDebugMode = false,
  ) {
    this.callback = callback;
  }

  step(frame: number) {
    if (this.callback) {
      this.callback.call(this, frame);
    }
  }
}
