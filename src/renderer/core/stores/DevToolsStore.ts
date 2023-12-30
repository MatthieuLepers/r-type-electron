import { reactive } from 'vue';
import DebugEntityScript from '@renderer/core/classes/DebugEntityScript';

interface IState {
  entities: Array<DebugEntityScript>;
  shown: Array<string>;
  pathShown: Array<string>;
  debugPause: boolean;
  selectedEntity: DebugEntityScript | null;
}

const devToolStore = function () {
  const state = reactive<IState>({
    entities: [],
    shown: [],
    pathShown: [],
    debugPause: false,
    selectedEntity: null,
  });

  const actions = {
    toggleShow(entity: DebugEntityScript) {
      if (state.shown.includes(entity.id)) {
        state.selectedEntity = null;
        state.shown = state.shown.filter((id) => id !== entity.id);
        entity.removeTag('debug');
      } else {
        state.selectedEntity = entity;
        state.shown.push(entity.id);
        entity.addTag('debug');
      }
    },
    toggleShowPath(entity: DebugEntityScript) {
      if (state.pathShown.includes(entity.id)) {
        state.pathShown = state.pathShown.filter((id) => id !== entity.id);
        entity.removeTag('debug-path');
      } else {
        state.pathShown.push(entity.id);
        entity.addTag('debug-path');
      }
    },
    isShown(entity: DebugEntityScript): boolean {
      return state.shown.includes(entity.id);
    },
    isPathShown(entity: DebugEntityScript): boolean {
      return state.pathShown.includes(entity.id);
    },
  };

  return {
    state,
    actions,
  };
};

export const useDevToolStore = devToolStore();
