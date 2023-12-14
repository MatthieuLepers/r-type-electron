/* eslint-disable max-classes-per-file */
export interface Ctor<T = NonNullable<any>> {
  new(...params: any[]): T;
}

export interface MixIn<Superclass extends Ctor, Extension extends Ctor> {
  (ctor: Superclass): Superclass & Extension;
}

export interface Mixed<T extends Ctor> {
  with<K extends Ctor>(mixin: MixIn<T, K>): Mixed<ReturnType<MixIn<T, K>>> & ReturnType<MixIn<T, K>>;
}

export class MixinBuilder<T extends Ctor> {
  constructor(public superclass: T) {}

  with<K extends Ctor>(mixin: MixIn<T, K>): Mixed<ReturnType<MixIn<T, K>>> & ReturnType<MixIn<T, K>> {
    const mixed = mixin(this.superclass);
    return class extends mixed {
      static with<K1 extends Ctor>(mixin1: MixIn<typeof mixed, K1>) {
        return new MixinBuilder(mixed).with(mixin1);
      }
    } as any;
  }
}

export function mix<T>(superclass: Ctor<T>) {
  return new MixinBuilder(superclass);
}
