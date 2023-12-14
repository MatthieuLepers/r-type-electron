import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type Physics from '@/renderer/core/classes/components/typescript/Physics';
import type { IPhysics } from '@/renderer/core/classes/components/typescript/Physics/i';

export const PhysycsMixin = (superclass: Constructor<Class>) => class extends superclass implements IPhysics {
  declare components: {
    physics: Physics,
  };

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
