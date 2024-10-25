export interface ICooldown {
  cooldownActive(): boolean;

  startCooldown(): void;

  resetCooldown(): void;

  setCooldown(time: number): void;
}
