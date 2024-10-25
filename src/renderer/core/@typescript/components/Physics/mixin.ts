import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import type Class from '@renderer/core/@typescript/Class';
import Physics from '@renderer/core/@typescript/components/Physics';
import type { IPhysics } from '@renderer/core/@typescript/components/Physics/i';

export const PhysicsMixin = <T extends AnyConstructor<Class>>(base : T) => class MyPhysicsMixin extends base implements IPhysics {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(Physics, MyPhysicsMixin);
  }

  addCollisionTag(...tags: Array<string>): this {
    tags.forEach((tag) => {
      if (tag.startsWith('!')) {
        this.components.physics.collideTagsExcluded.push(tag.substring(1));
      } else {
        this.components.physics.collideTags.push(tag);
      }
    });
    return this;
  }

  removeCollisionTag(...tags: Array<string>): this {
    tags.forEach((tag) => {
      if (tag.startsWith('!')) {
        this.components.physics.collideTagsExcluded = this.components.physics.collideTagsExcluded.filter((t) => t !== tag.substring(1));
      } else {
        this.components.physics.collideTags = this.components.physics.collideTags.filter((t) => t !== tag);
      }
    });
    return this;
  }
};
