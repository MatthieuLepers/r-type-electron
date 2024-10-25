export default class Runnable {
  public callback: (frame?: number) => void;

  constructor(
    public name: string,
    callback = null,
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
