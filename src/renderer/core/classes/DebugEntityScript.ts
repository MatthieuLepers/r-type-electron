export interface IDebugEntityScriptData {
  id: string,
  attachedTo: boolean,
  tags: Array<string>,
  components: {
    attachedentities?: Record<string, IDebugEntityScriptData>,
    locomotor?: {
      path: string,
      percent: number,
    },
  },
}

export default class DebugEntityScript {
  constructor(public data: IDebugEntityScriptData) {}

  get id(): string {
    return this.data.id;
  }

  get components() {
    return this.data.components;
  }

  get attachedTo(): boolean {
    return this.data.attachedTo;
  }

  get tags(): Array<string> {
    return this.data.tags;
  }

  addTag(...tags: Array<string>) {
    api.invoke('sendDataToWindow', 'main', this.id, [{ callback: 'addTag', args: tags }]);
  }

  removeTag(...tags: Array<string>) {
    api.invoke('sendDataToWindow', 'main', this.id, [{ callback: 'removeTag', args: tags }]);
  }

  getAttachedEntities(): Record<string, DebugEntityScript> {
    return Object
      .entries(this.components?.attachedentities ?? {})
      .reduce((acc, [key, value]) => ({ ...acc, [key]: new DebugEntityScript(value) }), {})
    ;
  }
}
