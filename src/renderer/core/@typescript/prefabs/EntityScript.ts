import Global from '@renderer/core/stores/AppStore';
import { mix } from '@renderer/core/@types/Mixable';

import Class from '@renderer/core/@typescript/Class';
import { EventEmitterMixin } from '@renderer/core/@typescript/components/EventEmitter/mixin';
import { SoundEmitterMixin } from '@renderer/core/@typescript/components/SoundEmitter/mixin';
import { DebugMixin } from '@renderer/core/@typescript/components/Debug/mixin';
import Runnable from '@renderer/core/@typescript/runnable/Runnable';
import AbstractClassError from '@renderer/core/@typescript/errors/AbstractClassError';

export default class EntityScript extends mix(Class)
  .with(EventEmitterMixin)
  .with(SoundEmitterMixin)
  .with(DebugMixin) {
  public initCallback?: Function;

  public tags: Array<string> = [];

  public runnable?: Runnable = null;

  public damages?: number;

  public attachedTo?: EntityScript = null;

  constructor(initCallback?: Function) {
    super();
    if (this.constructor.name === 'EntityScript') {
      throw new AbstractClassError(this.constructor);
    }
    this.initCallback = initCallback;

    if (typeof this.initCallback === 'function') {
      this.initCallback.call(this);
    }
  }

  addTag(...tags: Array<string>) {
    tags.forEach((tag) => {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag);
      }
    });
    this.emit('tagAdded', { tags });
  }

  removeTag(...tags: Array<string>) {
    this.tags = this.tags.filter((tag) => !tags.includes(tag));
    this.emit('tagRemoved', { tags });
  }

  hasTag(...tags: Array<string>): boolean {
    return tags.reduce((acc, tag) => acc && (tag.startsWith('!') ? !this.tags.includes(tag.substring(1)) : this.tags.includes(tag)), true);
  }

  spawn(): EntityScript {
    const { sprite, attachedentities, physics } = this.components;
    if (sprite) {
      Global.Game.entities[sprite.id] = this;
    }
    if (attachedentities) {
      Object.values(attachedentities.entities).forEach((entity) => {
        entity.spawn();
      });
    }
    if (physics) {
      Global.Game.quadTree.insert(this);
    }

    const componentWithTaskList = this
      .getComponentByPriority()
      .filter((c) => typeof c.task === 'function')
    ;
    if (componentWithTaskList.length) {
      this.runnable = new Runnable(`runnable${sprite.id}`, (frame: number) => {
        componentWithTaskList.forEach((c) => {
          if (c.task) {
            c.task(frame);
          }
        });
      });

      Global.Engine.addRunnable(this.runnable);
    }
    this.emit('spawn', { entity: this });
    return this;
  }

  despawn() {
    const { sprite, attachedentities } = this.components;
    if (attachedentities) {
      Object.values(attachedentities.entities).forEach((entity) => { entity.despawn(); });
    }
    if (this.runnable) {
      Global.Engine.removeRunnable(this.runnable);
    }
    if (sprite) {
      if (Global.Game.entities[sprite.id]) {
        delete Global.Game.entities[sprite.id];
      }
    }
    Global.Game.canvasObj.removeDrawables(this);
    this.emit('despawn');
  }

  toDebugObject(): any {
    return {
      components: Object
        .entries(this.components)
        .filter(([, component]) => typeof component.toDebugObject === 'function')
        .reduce((acc, [componentName, component]) => ({
          ...acc,
          [componentName]: component.toDebugObject(),
        }), {}),
      tags: this.tags,
    };
  }
}
