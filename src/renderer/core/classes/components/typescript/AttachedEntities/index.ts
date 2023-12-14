import Component from '@renderer/core/classes/components/Component';
import type { TEntityScript } from '@renderer/core/classes/prefabs/TEntityScript';

export default class AttachedEntities extends Component {
  public entities: Record<string, TEntityScript> = {};
}
