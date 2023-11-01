import AbstractRessourceStore from '@renderer/core/stores/AbstractRessourceStore';
import type Asset from '@renderer/core/classes/ressources/Asset';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
class AssetStore extends AbstractRessourceStore<Asset> {
}

export default new AssetStore();
