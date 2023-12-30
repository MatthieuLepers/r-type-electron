<template>
  <div
    class="control-type-choice"
    :class="{ small: props.small }"
  >
    <label class="control-type-choice__label">
      Point type
    </label>
    <div class="control-type-choice__choice-list">
      <label class="control-type-choice__choice">
        <input
          class="control-type-choice__choice-input"
          type="radio"
          value="L"
          :name="`pointType${$uid}`"
          :checked="props.modelValue === 'L'"
          @change="emit('update:modelValue', $event.target.value)"
        >
        <div class="control-type-choice__choice-input-fake">L</div>
      </label>
      <label class="control-type-choice__choice">
        <input class="control-type-choice__choice-input"
          type="radio"
          value="C"
          :name="`pointType${$uid}`"
          :checked="props.modelValue === 'C'"
          @change="emit('update:modelValue', $event.target.value)"
        >
        <div class="control-type-choice__choice-input-fake">C</div>
      </label>
      <label class="control-type-choice__choice">
        <input
          class="control-type-choice__choice-input"
          type="radio"
          value="Q"
          :name="`pointType${$uid}`"
          :checked="props.modelValue === 'Q'"
          @change="emit('update:modelValue', $event.target.value)"
        >
        <div class="control-type-choice__choice-input-fake">Q</div>
      </label>
      <label class="control-type-choice__choice">
        <input
          class="control-type-choice__choice-input"
          type="radio"
          value="A"
          :name="`pointType${$uid}`"
          :checked="props.modelValue === 'A'"
          @change="emit('update:modelValue', $event.target.value)"
        >
        <div class="control-type-choice__choice-input-fake">A</div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

defineOptions({ name: 'ControlTypeChoice' });

const emit = defineEmits(['update:modelValue', 'click']);
const $uid = getCurrentInstance().uid;

const props = defineProps({
  modelValue: { type: String },
  small: { type: Boolean, default: false },
  prevType: { type: String, default: 'M' },
});

</script>

<style lang="scss" src="./ControlTypeChoice.scss">
</style>
