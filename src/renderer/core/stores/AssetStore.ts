import AbstractRessourceStore from '@renderer/core/stores/AbstractRessourceStore';

import type Asset from '@renderer/core/@typescript/ressources/Asset';

class AssetStore extends AbstractRessourceStore<Asset> {
}

export default new AssetStore();
