import Global from '@renderer/core/stores/AppStore';
import Class from '@renderer/core/classes/Class';
import type Component from '@renderer/core/classes/components/Component';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';
import SoundEmitter from '@renderer/core/classes/components/SoundEmitter';
import AbstractClassError from '@renderer/core/classes/errors/AbstractClassError';
import Runnable from '@renderer/core/classes/runnable/Runnable';
import type { Constructor } from '@renderer/core/@types';

export default abstract class EntityScript extends Class {
  declare getId: () => number;

  declare getAttachedEntities: () => Record<string, EntityScript>;

  declare emit: (eventName: string, details?: Record<string, any>) => void;

  public initCallback: Function | null = null;

  public tags: Array<string> = [];

  public runnable: Runnable | null = null;

  constructor(initCallback: Function | null) {
    super();
    if (this.constructor.name === 'EntityScript') {
      throw new AbstractClassError(this);
    }
    this.initCallback = initCallback;

    this.addComponent(EventEmitter, EntityScript);
    this.addComponent(SoundEmitter, EntityScript);

    if (typeof this.initCallback === 'function') {
      this.initCallback.call(this);
    }
  }

  addComponentAt(key: string, component: Constructor<Component>, clazz: Function) {
    this.components[key.toLowerCase()] = Global.ModKnowledge.applyComponentBundle(component.name, new component(this, clazz));
  }

  addTag(...tags: Array<string>) {
    tags.forEach((tag) => {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
      }
    });
  }

  removeTag(...tags: Array<string>) {
    this.tags = this.tags.filter((tag) => !tags.includes(tag));
  }

  hasTag(...tags: Array<string>): boolean {
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
      this.runnable = new Runnable(`runnable${this.getId()}`, (frame: number) => {
        componentWithTaskList.forEach((c) => {
          if (c.task) {
            c.task(frame);
          }
        });
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

  static new(...args: any[]): EntityScript {
    // @ts-ignore
    return Global.ModKnowledge.applyPrefabBundle(this.name, new this(...args));
  }

  /**
   * @param {ModManager} ModKnowledge
   */
  applyModsBundle(ModKnowledge) {
    ModKnowledge.applyPrefabBundle(this.constructor.name, this);
  }
}
