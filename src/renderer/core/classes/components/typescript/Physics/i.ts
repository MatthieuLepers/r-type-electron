import type Physics from '@/renderer/core/classes/components/typescript/Physics';

export interface IPhysics {
  components: {
    physics: Physics,
  };

  addCollisionTag(...tags: Array<string>): this;

  removeCollisionTag(...tags: Array<string>): this;
}
