import Global from '@renderer/core/stores/AppStore';
import Class from '@renderer/core/classes/Class';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';
import SoundEmitter from '@renderer/core/classes/components/SoundEmitter';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';
import Runnable from '@renderer/core/classes/runnable/Runnable';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class EntityScript extends Class {
  /**
   * @constructor
   * @param {Function} initCallback
   */
  constructor(initCallback = null) {
    super();
    if (this.constructor.name === 'EntityScript') {
      throw new AbstractClassError(this);
    }
    this.tags = [];
    this.initCallback = initCallback;
    this.runnable = null;

    this.addComponent(EventEmitter, EntityScript);
    this.addComponent(SoundEmitter, EntityScript);

    if (typeof initCallback === 'function') {
      this.initCallback.call(this);
    }
  }

  /**
   * @param {String} key
   * @param {String} component
   * @param {String} clazz
   */
  addComponentAt(key, component, clazz) {
    this.components[key.toLowerCase()] = Global.ModKnowledge.applyComponentBundle(component.name, new component(this, clazz));
  }

  /**
   * @param {String[]} tags
   * @return {this}
   */
  addTag(...tags) {
    tags.forEach((tag) => {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
      }
    });
    return this;
  }

  /**
   * @param {String[]} tags
   * @return {this}
   */
  removeTag(...tags) {
    this.tags = this.tags.filter((tag) => !tags.includes(tag));
    return this;
  }

  /**
   * @param {String[]} tags
   * @return {Boolean}
   */
  hasTag(...tags) {
    return tags.reduce((acc, tag) => acc && (tag.startsWith('!') ? !this.tags.includes(tag.substring(1)) : this.tags.includes(tag)), true);
  }

  /**
   * @return {this}
   */
  spawn() {
    this.addTag('staySpawned');
    if (this.hasComponent('Sprite')) {
      Global.Game.entities[this.getId()] = this;
    }
    if (this.hasComponent('AttachedEntities')) {
      Object.values(this.getAttachedEntities()).forEach((entity) => { entity.spawn(); });
    }
    if (this.hasComponent('Physics')) {
      Global.Game.quadTree.insert(this);
    }

    const componentWithTaskList = this
      .getComponentByPriority()
      .filter((c) => typeof c.task === 'function')
    ;
    if (componentWithTaskList.length) {
      this.runnable = new Runnable(`runnable${this.getId()}`, (frame) => {
        componentWithTaskList.forEach((c) => { c.task(frame); });
      });

      Global.Engine.addRunnable(this.runnable);
    }
    window.setTimeout(() => this.removeTag('staySpawned'), 1000);
    this.emit('spawn', { entity: this });
    return this;
  }

  despawn() {
    if (this.hasComponent('AttachedEntities')) {
      Object.values(this.getAttachedEntities()).forEach((entity) => { entity.despawn(); });
    }
    if (this.runnable) {
      Global.Engine.removeRunnable(this.runnable);
    }
    if (this.hasComponent('Sprite')) {
      if (Global.Game.entities[this.getId()]) {
        delete Global.Game.entities[this.getId()];
      }
      Global.Game.canvasObj.removeDrawables(this);
    }
    this.emit('despawn');
  }

  /**
   * @param  {...any} args
   * @return {EntityScript}
   */
  static new(...args) {
    return Global.ModKnowledge.applyPrefabBundle(this.name, new this(...args));
  }

  /**
   * @param {ModManager} ModKnowledge
   */
  applyModsBundle(ModKnowledge) {
    ModKnowledge.applyPrefabBundle(this.constructor.name, this);
  }
}
