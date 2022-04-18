<template>
  <div :class="GenerateModifiers('DataTableColumn', modifiers)">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DataTableColumn',
  props: {
    modifiers: { type: Object, default: () => ({}) },
  },
};
</script>

<style lang="scss" src="./Column.scss">
</style>
