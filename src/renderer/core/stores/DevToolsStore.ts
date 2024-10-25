import { reactive } from 'vue';

interface IState {
  entities: Array<Object>;
  shown: Array<string>;
  pathShown: Array<string>;
  debugPause: boolean;
  selectedEntity: Object | null;
}

const useDevToolStore = function () {
  const state = reactive<IState>({
    entities: [],
    shown: [],
    pathShown: [],
    debugPause: false,
    selectedEntity: null,
  });

  const actions = {
    toggleShow(entity) {
      if (state.shown.includes(entity.components?.sprite?.id)) {
        state.selectedEntity = null;
        state.shown = state.shown.filter((id) => id !== entity.components?.sprite?.id);
        api.invoke('sendDataToWindow', 'main', entity.components?.sprite?.id, [{ callback: 'removeTag', args: ['debug'] }]);
      } else {
        state.selectedEntity = entity;
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
    actions,
  };
};

export const devToolStore = useDevToolStore();
