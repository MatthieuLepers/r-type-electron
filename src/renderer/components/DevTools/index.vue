<template>
  <aside class="devtools">
    <MaterialTabs
      v-model="state.currentTab"
      :tabs="State.tabs"
      class="devtools__tabs"
    >
      <template v-slot:console>
        <DevToolsConsoleTab />
      </template>
      <template v-slot:entities>
        <DevToolsEntitiesTab />
      </template>
    </MaterialTabs>
  </aside>
</template>

<script setup>
import { reactive, computed } from 'vue';

import MaterialTabs from '@renderer/components/Materials/Tabs/index.vue';
import DevToolsConsoleTab from '@renderer/components/DevTools/ConsoleTab.vue';
import DevToolsEntitiesTab from '@renderer/components/DevTools/EntitiesTab.vue';

defineOptions({ name: 'DevTools' });

const state = reactive({
  currentTab: 'console',
});

const State = computed(() => ({
  tabs: {
    console: {
      label: 'Console',
    },
    entities: {
      label: 'Entities',
    },
  },
}));
</script>

<style lang="scss" src="./index.scss">
</style>
