<template>
  <MaterialTitleBar
    name="devTools"
    appTitle="R-Type Electron - DevTools"
    :minimizable="false"
    :maximizable="false"
    :showHelp="false"
  />
  <main class="devtools-layout" v-bind="$attrs">
    <MaterialFormFieldLine>
      <MaterialFormToggle
        v-model="state.debugPause"
        label="Debug Pause"
      />
    </MaterialFormFieldLine>
    <slot />
  </main>
</template>

<script setup>
import { reactive, watch } from 'vue';

import MaterialTitleBar from '@renderer/components/Materials/TitleBar/index.vue';
import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormToggle from '@renderer/components/Materials/Form/Toggle.vue';

import { useDevToolStore } from '@renderer/core/stores/DevToolsStore';

defineOptions({ name: 'DevToolsLayout' });

const state = reactive({
  debugPause: useDevToolStore.state.debugPause,
});

watch(() => state.debugPause, (newVal) => {
  api.invoke('sendDataToWindow', 'main', 'toggleDebugPause', newVal);
});
</script>

<style lanc="scss" src="./DevToolsLayout.scss">
</style>
