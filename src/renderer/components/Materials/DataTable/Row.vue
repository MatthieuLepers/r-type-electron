<template>
  <div
    :class="GenerateModifiers('DataTableRow', modifiers)"
    @click="$emit('click', $event)"
    @contextmenu.prevent.stop="$emit('contextmenu', $event)"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DataTableRow',
  props: {
    modifiers: { type: Object, default: () => ({}) },
  },
};
</script>

<style lang="scss" src="./Row.scss">
</style>
