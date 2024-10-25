import { AnyConstructor } from '@/renderer/core/@types/Mixin';
import { Components, ComponentsValues } from '@renderer/core/@typescript/components';
import type Component from '@renderer/core/@typescript/components/Component';

export default class Class {
  public components: Partial<Components> = {};

  addComponent<T extends Component<any>>(component: AnyConstructor<T>, clazz: Function) {
    this.addComponentAt(component.name, component, clazz ?? this.constructor);
  }

  addComponentAt<T extends Component<any>>(key: string, component: AnyConstructor<T>, clazz: Function) {
    if (!this.hasComponent(key)) {
      this.components[key.toLowerCase()] = new component(this, clazz);
    }
  }

  removeComponent(component: string) {
    delete this.components[component.toLowerCase()];
  }

  hasComponent(component: string): boolean {
    return !!this.components[component.toLowerCase()];
  }

  getClass(): string {
    return this.constructor.name;
  }

  getParentClass(): string {
    return Object.getPrototypeOf(this.constructor).name;
  }

  getAllParentClass(): Array<string> {
    const allParent: Array<string> = [];
    let baseClass = this.constructor;

    while (baseClass) {
      allParent.push(baseClass.name);
      const newBaseClass = Object.getPrototypeOf(baseClass);
      if (newBaseClass && newBaseClass !== Object && newBaseClass.name) {
        baseClass = newBaseClass;
      } else {
        break;
      }
    }

    return allParent;
  }

  getComponentByPriority(): Array<ComponentsValues> {
    return Object.values(this.components).sort((a, b) => a.priority - b.priority);
  }

  isExtending(clazz: string | Function): boolean {
    return this.getAllParentClass().indexOf(typeof clazz !== 'function' ? clazz : clazz.prototype.constructor.name) >= 0;
  }
}
