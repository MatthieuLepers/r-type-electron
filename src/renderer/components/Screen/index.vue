<template>
  <div class="screen">
    <h1
      v-if="props.title"
      class="screen__title"
    >
      {{ props.title }}
    </h1>
    <div class="screen__content">
      <slot name="content" />
    </div>
    <div class="screen__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'Screen' });

const props = defineProps({
  title: { type: String, default: null },
});
</script>

<style lang="scss" src="./index.scss">
</style>
