<template>
  <AppTitleBar name="main" />
  <main class="main-layout" v-bind="$attrs">
    <slot />
  </main>
</template>

<script setup>
import AppTitleBar from '@renderer/components/AppTitleBar/index.vue';

defineOptions({ name: 'MainLayout' });
</script>

<style lang="scss" src="./MainLayout.scss">
</style>
