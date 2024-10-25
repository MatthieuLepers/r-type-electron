export default abstract class AbstractCommand {
  public args: Array<string> = [];

  constructor(
    public cmd: string,
    ...args: Array<string>
  ) {
    this.args = args ?? [];
  }

  abstract execute(): string;
}
