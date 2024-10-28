import Class from '@renderer/core/@typescript/Class';

export enum Priority {
  LOW = 1,
  NORMAL = 0,
  HIGH = -1,
}

export default class Component<T> extends Class {
  constructor(
    public inst: T,
    public clazz: Function,
    public priority: number = Priority.NORMAL,
  ) {
    super();
  }

  task?(frame: number): void;

  toDebugObject?();
}
