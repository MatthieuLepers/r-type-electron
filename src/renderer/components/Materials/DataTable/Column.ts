export interface ISlots {
  default(): void;
}

export type TypeModifiers = 'noActionRow' | 'action';

export interface IProps {
  modifiers?: Record<TypeModifiers, boolean> | {};
}
