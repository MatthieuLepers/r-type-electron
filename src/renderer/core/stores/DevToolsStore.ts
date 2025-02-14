import { reactive, computed } from 'vue';
import { api } from '@renderer/core/api';

interface IState {
  entities: Array<Object>;
  shown: Array<string>;
  pathShown: Array<string>;
  debugPause: boolean;
  selectedEntity: Array<Object>;
}

const useDevToolStore = function () {
  const state = reactive<IState>({
    entities: [],
    shown: [],
    pathShown: [],
    debugPause: false,
    selectedEntity: [],
  });

  const selectedEntity = computed(() => state.selectedEntity[state.selectedEntity.length - 1]);

  const actions = {
    toggleShow(entity) {
      if (state.shown.includes(entity.components?.sprite?.id)) {
        state.selectedEntity = state.selectedEntity.filter((e) => entity !== e);
        state.shown = state.shown.filter((id) => id !== entity.components?.sprite?.id);
        api.invoke('sendDataToWindow', 'main', entity.components?.sprite?.id, [{ callback: 'removeTag', args: ['debug'] }]);
      } else {
        state.selectedEntity.push(entity);
        state.shown.push(entity.components?.sprite?.id);
        api.invoke('sendDataToWindow', 'main', entity.components?.sprite?.id, [{ callback: 'addTag', args: ['debug'] }]);
      }
    },
    toggleShowPath(entity) {
      if (state.pathShown.includes(entity.components?.sprite?.id)) {
        state.pathShown = state.pathShown.filter((id) => id !== entity.components?.sprite?.id);
        api.invoke('sendDataToWindow', 'main', entity.components?.sprite?.id, [{ callback: 'removeTag', args: ['debug-path'] }]);
      } else {
        state.pathShown.push(entity.components?.sprite?.id);
        api.invoke('sendDataToWindow', 'main', entity.components?.sprite?.id, [{ callback: 'addTag', args: ['debug-path'] }]);
      }
    },
    isShown(entity): boolean {
      return state.shown.includes(entity.components?.sprite?.id);
    },
    isPathShown(entity): boolean {
      return state.pathShown.includes(entity.components?.sprite?.id);
    },
  };

  return {
    state,
    selectedEntity,
    actions,
  };
};

export const devToolStore = useDevToolStore();
