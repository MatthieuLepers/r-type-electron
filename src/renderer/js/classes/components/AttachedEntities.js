import { AddClassMethod } from '../../Utils';
import Component from './Component';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class AttachedEntities extends Component {
  /**
   * @inheritdoc
   */
  constructor(inst, clazz) {
    super(inst, clazz);
    this.entities = {};

    /**
     * @return {EntityScript{}}
     */
    AddClassMethod(this.clazz, 'getAttachedEntities', function () {
      return this.components.attachedentities.entities;
    });

    /**
     * @param {String} entityId
     * @return {EntityScript}
     */
    AddClassMethod(this.clazz, 'getAttachedEntity', function (entityId) {
      return this.components.attachedentities.entities[entityId];
    });

    /**
     * @param {EntityScript} entity
     * @param {String|null} entityId
     * @return {this}
     */
    AddClassMethod(this.clazz, 'attachEntity', function (entity, entityId = null) {
      this.components.attachedentities.entities[entityId || entity.getId()] = entity;
      entity.attached = true;
      entity.attachedTo = this;
      entity.addTag('attached');
      if (this.hasComponent('EventEmitter')) {
        this.emit('attachEntity', { entity });
      }
      if (entity.hasComponent('EventEmitter')) {
        entity.emit('attached', { parent: this });
      }
      return this;
    });

    /**
     * @param {EntityScript} entity
     * @param {String|null} entiyId
     * @return {this}
     */
    AddClassMethod(this.clazz, 'detachEntity', function (entity, entityId = null) {
      if (this.components.attachedentities.entities[entityId || entity.getId()]) {
        delete this.components.attachedentities.entities[entityId || entity.getId()];
        delete entity.attached;
        delete entity.attachedTo;
        entity.removeTag('attached');
        if (this.hasComponent('EventEmitter')) {
          this.emit('detachEntity', { entity });
        }
        if (entity.hasComponent('EventEmitter')) {
          entity.emit('detached', { parent: this });
        }
      }
      return this;
    });

    /**
     * @param {EntityScript} entityId
     * @return {Boolean}
     */
    AddClassMethod(this.clazz, 'isEntityAttached', function (entityId) {
      return !!this.getAttachedEntity(entityId);
    });
  }
}
