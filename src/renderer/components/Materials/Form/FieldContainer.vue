<template>
  <div :class="GenerateModifiers('FormFieldContainer', modifiers)">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FormFieldContainer',
  props: {
    modifiers: { type: Object, default: () => ({}) },
  },
};
</script>

<style lang="scss" src="./FieldContainer.scss">
</style>
