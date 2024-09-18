<template>
  <slot name="before" />
  <div class="AppProgressBar">
    <span
      class="AppPrograssBarTrack"
      :style="{ width: `calc(${props.percent}% - 4px)` }"
    >
      <slot name="track">
        {{  props.percent }}
      </slot>
    </span>
  </div>
  <slot name="after" />
</template>

<script setup>
defineOptions({ name: 'AppProgressBar' });

const props = defineProps({
  percent: { type: Number, default: 0 },
});
</script>

<style lang="scss" src="./index.scss">
</style>
