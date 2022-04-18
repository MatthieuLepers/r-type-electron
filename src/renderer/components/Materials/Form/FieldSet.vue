<template>
  <fieldset class="FormFieldSet">
    <legend class="FormFieldSetLegend">
      <slot name="legend">{{ legend }}</slot>
    </legend>
    <div class="FormFieldSetContent">
      <slot />
    </div>
  </fieldset>
</template>

<script>
export default {
  name: 'FormFieldSet',
  props: {
    legend: { type: String, required: true },
  },
};
</script>

<style lang="scss" src="./FieldSet.scss">
</style>
