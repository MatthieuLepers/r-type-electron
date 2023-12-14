import Component from '@renderer/core/classes/components/Component';
import EventListener from '@renderer/core/classes/EventListener';

export default class EventEmitter extends Component {
  public listeners: Map<string, Map<Function, EventListener>> = new Map<string, Map<Function, EventListener>>();
}
