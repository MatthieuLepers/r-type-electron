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
        <DevToolsEntityTab />
      </template>
    </MaterialTabs>
  </aside>
</template>

<script setup>
import { reactive, computed } from 'vue';

import MaterialTabs from '@renderer/components/Materials/Tabs/index.vue';
import DevToolsConsoleTab from '@renderer/components/DevTools/ConsoleTab.vue';
import DevToolsEntityTab from '@renderer/components/DevTools/EntitiesTab.vue';

defineOptions({ name: 'DevTools' });

const state = reactive({
  currentTab: 'entities',
});

const State = computed(() => ({
  tabs: [
    { id: 'console', label: 'Console' },
    { id: 'entities', label: 'Entities' },
  ],
}));
</script>

<style lang="scss" src="./index.scss">
</style>
