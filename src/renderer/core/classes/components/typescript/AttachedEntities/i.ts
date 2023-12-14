import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import type AttachedEntities from '@/renderer/core/classes/components/typescript/AttachedEntities';

export interface IAttachedEntities {
  components: {
    attachedentities: AttachedEntities,
  };

  attachedTo: TEntityScript | null;

  getAttachedEntities(): Record<string, TEntityScript>;

  getAttachedEntity(entityId: string): TEntityScript | null;

  attachEntity(entity: TEntityScript, entityId?: string): void;

  detachEntity(entity: TEntityScript, entityId?: string): void;

  isEntityAttached(entityId: string): boolean;
}
