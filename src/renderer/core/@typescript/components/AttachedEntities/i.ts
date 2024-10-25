import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export interface IAttachedEntities {
  getAttachedEntities(): Record<string, EntityScript>;

  getAttachedEntity<T = EntityScript>(entityId: string): T | null;

  attachEntity(entity: EntityScript, entityId?: string): void;

  detachEntity(entity: EntityScript, entityId?: string): void;

  isEntityAttached(entityId: string): boolean;
}
