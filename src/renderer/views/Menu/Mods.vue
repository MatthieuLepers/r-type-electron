<template>
  <MainLayout class="menu-mods-screen">
    <Screen title="Mods">
      <template v-slot:content>
        <div
          class="menu-mods-screen__navigation"
          @mousewheel="actions.handleMouseWheel"
        >
          <button
            v-for="(mod, i) in Object.values(State.modList)"
            :key="i"
            :class="GenerateModifiers('menu-mods-screen__navigation__button', { selected: state.selected === mod})"
          >
            <img :src="actions.getModIcon(mod)" :alt="mod.name" />
            <div>
              {{ mod.name }}
              <span v-if="mod.$crashed">(Crashed!)</span>
            </div>
            <input type="checkbox" :checked="mod.$enabled && !mod.$crashed" />
          </button>
        </div>
        <div
          v-if="state.selected"
          class="menu-mods-screen__container"
        >
          <h2>{{ state.selected.name }}</h2>
          <p>{{ state.selected.desc }}</p>
        </div>
      </template>
      <template v-slot:footer>
        <ScreenMenuButton
          :to="{ name: 'Menu' }"
          :modifiers="{ tiny: true }"
        >
          Back
        </ScreenMenuButton>
      </template>
    </Screen>
  </MainLayout>
</template>

<script setup>
import { reactive, computed, onBeforeMount } from 'vue';

import MainLayout from '@renderer/views/MainLayout.vue';
import Screen from '@renderer/components/Screen/index.vue';
import ScreenMenuButton from '@renderer/components/Screen/MenuButton.vue';

import Global from '@renderer/core/stores/AppStore';

defineOptions({ name: 'MenuModsScreen' });

const state = reactive({
  selected: null,
});

const State = computed(() => ({
  modList: Object.values(Global.ModKnowledge.modList),
}));

const actions = {
  handleMouseWheel(e) {
    const direction = e.deltaY > 0 ? 1 : -1;
    if (e.target.matches('.menu-mods-screen__navigation') ?? e.target.closest('.menu-mods-screen__navigation')) {
      const target = e.target.closest('.menu-mods-screen__navigation') ?? e.target;
      target.scrollTop += 60 * direction;
    }
  },
  getModIcon(mod) {
    return mod.icon ?? 'public/img/gui/module.png';
  },
};

onBeforeMount(() => {
  [state.selected] = State.value.modList;
});
</script>

<style lang="scss" src="./Mods.scss">
</style>
