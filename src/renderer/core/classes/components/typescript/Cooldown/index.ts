import Component from '@renderer/core/classes/components/Component';

export default class Cooldown extends Component {
  public active: boolean = false;

  public time: number = 0;

  #timer: number | null = null;

  start() {
    if (!this.active && this.time > 0) {
      this.active = true;
      this.#timer = window.setTimeout(() => { this.reset(); }, this.time);
    }
  }

  reset() {
    this.active = false;
    if (this.#timer) {
      window.clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
}
