<template>
  <div class="control-toggle">
    <label
      v-if="props.label"
      :for="`input${$uid}`"
      class="control-toggle__label"
    >
      {{ props.label }}
    </label>
    <label class="control-toggle__container">
      <input
        class="control-toggle__input"
        type="checkbox"
        :checked="props.modelValue"
        :id="`input${$uid}`"
        @click="emit('update:modelValue', !props.modelValue)"
      >
      <div class="control-toggle__input-fake"></div>
    </label>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

defineOptions({ name: 'ControlToggle' });

const emit = defineEmits(['update:modelValue']);
const $uid = getCurrentInstance().uid;

const props = defineProps({
  modelValue: { type: Boolean },
  label: { type: String, default: null },
});
</script>

<style lang="scss" src="./ControlToggle.scss">
</style>
