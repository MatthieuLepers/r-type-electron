import type { AnyConstructor } from '@/renderer/core/@types/Mixin';

import AttachedEntities from '@renderer/core/@typescript/components/AttachedEntities';
import type { IAttachedEntities } from '@renderer/core/@typescript/components/AttachedEntities/i';
import type { IEventEmitter } from '@renderer/core/@typescript/components/EventEmitter/i';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';

export const AttachedEntitiesMixin = <T extends AnyConstructor<EntityScript & IEventEmitter>>(base : T) => class MyAttachedEntitiesMixin extends base implements IAttachedEntities {
  constructor(...args: any[]) {
    super(...args);

    this.addComponent(AttachedEntities, MyAttachedEntitiesMixin);
  }

  getAttachedEntities(): Record<string, EntityScript> {
    return this.components.attachedentities.entities;
  }

  getAttachedEntity<E = EntityScript>(entityId: string): E | null {
    return this.components.attachedentities.entities[entityId] as E ?? null;
  }

  attachEntity(entity: EntityScript, entityId?: string) {
    this.components.attachedentities.entities[entityId ?? entity.components.sprite.id] = entity;
    entity.attachedTo = this;
    entity.addTag('attached');
    if (this.hasComponent('EventEmitter')) {
      this.emit('attachEntity', { entity });
    }
    if (entity.hasComponent('EventEmitter')) {
      entity.emit('attached', { parent: this });
    }
  }

  detachEntity(entity: EntityScript, entityId?: string) {
    if (this.components.attachedentities.entities[entityId ?? entity.components.sprite.id]) {
      delete this.components.attachedentities.entities[entityId ?? entity.components.sprite.id];
      entity.attachedTo = null;
      entity.removeTag('attached');
      if (this.hasComponent('EventEmitter')) {
        this.emit('detachEntity', { entity });
      }
      if (entity.hasComponent('EventEmitter')) {
        entity.emit('detached', { parent: this });
      }
    }
  }

  isEntityAttached(entityId: string): boolean {
    return !!this.getAttachedEntity(entityId);
  }
};
