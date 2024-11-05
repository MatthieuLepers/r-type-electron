<template>
  <component :is="actions.getComponent()" :component="props.component" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const props = defineProps({
  component: { type: String, required: true },
});

const actions = {
  getComponent() {
    return defineAsyncComponent(async () => {
      return import(/* @vite-ignore */ `./${props.component}.vue`)
        .catch(() => import('@renderer/components/DevTools/Components/undefined.vue'));
    });
  },
};
</script>
