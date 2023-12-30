<template>
  <DevToolsLayout>
    <DevTools />
  </DevToolsLayout>
</template>

<script setup>
import DevToolsLayout from '@renderer/views/DevToolsLayout.vue';
import DevTools from '@renderer/components/DevTools/index.vue';

defineOptions({ name: 'DevToolsView' });

</script>

<style lang="scss" src="./index.scss">
</style>
