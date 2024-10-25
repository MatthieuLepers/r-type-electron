export interface ISprite {
  getId(): string;

  playAnimation(animName: string, loop: boolean): void;

  isVisible(): boolean;

  hide(): void;

  show(): void;
}
