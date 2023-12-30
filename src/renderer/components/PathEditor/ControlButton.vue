<template>
  <button
    class="control-button"
    :class="props.variant"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>

defineOptions({ name: 'ControlButton' });

const emit = defineEmits(['click']);

const props = defineProps({
  variant: { type: String, default: null },
});
</script>

<style lang="scss" src="./ControlButton.scss">
</style>
