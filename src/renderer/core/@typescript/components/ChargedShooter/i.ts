export interface IChargedShooter {
  chargeStart(): void;

  chargeStop(): void;

  shootCharged(percent?: number): void;
}
