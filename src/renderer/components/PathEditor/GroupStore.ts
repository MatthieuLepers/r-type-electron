import { reactive } from 'vue';

import PointGroup, { type PointGroupOptions } from '@renderer/components/PathEditor/PointGroup';

const groupStore = function () {
  const state = reactive<Array<PointGroup>>([]);

  const actions = {
    addGroup(x: number, y: number, settings: PointGroupOptions): PointGroup {
      const newGroup = new PointGroup(x, y, settings);
      newGroup.name = `Group ${state.length + 1}`;
      state.push(newGroup);

      return newGroup;
    },
    removeGroup(group: PointGroup) {
      state.splice(state.indexOf(group), 1);
    },
  };

  return {
    state,
    actions,
  };
};

export const useGroupStore = groupStore();
