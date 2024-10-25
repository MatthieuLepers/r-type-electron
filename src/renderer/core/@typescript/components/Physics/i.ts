export interface IPhysics {
  addCollisionTag(...tags: Array<string>): this;

  removeCollisionTag(...tags: Array<string>): this;
}
