import type { Constructor } from '@renderer/core/@types';
import type Class from '@renderer/core/classes/Class';
import type AttachedEntities from '@/renderer/core/classes/components/typescript/AttachedEntities';
import type { IAttachedEntities } from '@/renderer/core/classes/components/typescript/AttachedEntities/i';
import type EventEmitter from '@renderer/core/classes/components/EventEmitter';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';
import { mix } from '@renderer/core/mixins/Mixable';
import { EventEmitterMixin } from '@/renderer/core/classes/components/typescript/EventEmitter/mixin';

export const AttachedEntitiesMixin = (superclass: Constructor<Class>) => class extends mix(superclass).with(EventEmitterMixin) implements IAttachedEntities {
  declare components: {
    attachedentities: AttachedEntities,
    eventemitter: EventEmitter,
  };

  public attachedTo: TEntityScript | null = null;

  getAttachedEntities(): Record<string, TEntityScript> {
    return this.components.attachedentities.entities;
  }

  getAttachedEntity(entityId: string): TEntityScript | null {
    return this.components.attachedentities.entities[entityId] ?? null;
  }

  attachEntity(entity: TEntityScript, entityId?: string) {
    this.components.attachedentities.entities[entityId ?? entity.getId()] = entity;
    // @ts-ignore
    entity.attachedTo = this;
    entity.addTag('attached');
    if (this.hasComponent('EventEmitter')) {
      this.emit('attachEntity', { entity });
    }
    if (entity.hasComponent('EventEmitter')) {
      entity.emit('attached', { parent: this });
    }
  }

  detachEntity(entity: TEntityScript, entityId?: string) {
    if (this.components.attachedentities.entities[entityId ?? entity.getId()]) {
      delete this.components.attachedentities.entities[entityId ?? entity.getId()];
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
