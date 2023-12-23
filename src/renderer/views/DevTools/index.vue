<template>
  <MaterialTitleBar
    name="devTools"
    appTitle="R-Type Electron - DevTools"
    :minimizable="false"
    :maximizable="false"
    :showHelp="false"
  />
  <DevToolsEntityTab
    :entities="state.entities"
    class="devtoolView"
  />
</template>

<script setup>
import { reactive } from 'vue';

import MaterialTitleBar from '@renderer/components/Materials/TitleBar/index.vue';
import DevToolsEntityTab from '@renderer/components/DevTools/EntitiesTab.vue';

defineOptions({ name: 'DevToolsView' });

const state = reactive({
  entities: {},
});

api.on('reset', () => {
  state.entities = {};
});
api.on('onEntitySpawn', (e) => {
  const entity = JSON.parse(e);
  state.entities[entity.id] = entity;
});
api.on('onEntityDespawn', (entityId) => {
  delete state.entities[entityId];
});
</script>

<style lang="scss" src="./index.scss">
</style>
