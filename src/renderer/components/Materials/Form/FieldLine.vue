<template>
  <div :class="GenerateModifiers('FormFieldLine', { [size]: size > 1 })">
    <FormFieldContainer :modifiers="modifiers" v-for="i in slots" :key="i">
      <slot :name="`field${i}`" />
    </FormFieldContainer>
  </div>
</template>

<script>
import FormFieldContainer from './FieldContainer';

export default {
  name: 'FormFieldLine',
  components: { FormFieldContainer },
  props: {
    size: { type: Number, default: 1 },
    modifiers: { type: Object, default: () => ({}) },
  },
  computed: {
    slots() {
      return [...Array(this.size).keys()];
    },
  },
};
</script>

<style lang="scss" src="./FieldLine.scss">
</style>
