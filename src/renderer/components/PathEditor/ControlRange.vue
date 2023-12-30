<template>
  <div class="control-range">
    <label
      v-if="props.label"
      class="control-range__label"
      :for="$uid"
    >
      {{ props.label }}
    </label>
    <div class="control-range__container">
      <input
        class="control-range__input"
        type="range"
        :id="$uid"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :value="props.modelValue"
        @input="emit('update:modelValue', parseInt($event.target.value, 10))"
      >
      <ControlInput
        type="text"
        :modelValue="props.modelValue"
        control-range__control-input
      />
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

import ControlInput from '@renderer/components/PathEditor/ControlInput.vue';

defineOptions({ name: 'ControlRange' });

const emit = defineEmits(['update:modelValue']);
const $uid = getCurrentInstance().uid;

const props = defineProps({
  modelValue: { type: [String, Number] },
  min: { type: [String, Number], default: 0 },
  max: { type: [String, Number], default: 1 },
  step: { type: [String, Number], default: 1 },
  label: { type: String, default: null },
});
</script>

<style lang="scss" src="./ControlRange.scss">
</style>
