<template>
  <div :class="GenerateModifiers('FormToggle', { Focus: focused, [variant]: variant !== null })">
    <input
      type="checkbox"
      :id="`formToggle${_uid}`"
      :checked="value"
      @input="$emit('input', $event.target.checked)"
      @focus="handleFocus('focus', true)"
      @blur="handleFocus('blur', false)"
    />
    <label :for="`formToggle${_uid}`">
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'FormToggle',
  props: {
    value: { type: Boolean, required: true },
    label: { type: String, required: true },
    variant: { type: String, default: null },
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    handleFocus(type, value) {
      this.focused = value;
      this.$emit(type, this.focused);
    },
  },
};
</script>

<style lang="scss" src="./Toggle.scss">
</style>
