<template>
  <aside class="devtools">
    <DevToolsConsoleTab />
  </aside>
</template>

<script setup>
import DevToolsConsoleTab from '@renderer/components/DevTools/ConsoleTab.vue';

defineOptions({ name: 'DevTools' });
</script>

<style lang="scss" src="./index.scss">
</style>
