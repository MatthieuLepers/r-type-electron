export interface IEmits extends Record<string, any> {
  click: [e: MouseEvent, id: string];
}

export interface ISlots {
  default(): void;
}

export interface IProps {
  id: string;
  label?: string;
}
