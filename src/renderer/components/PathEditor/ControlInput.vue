<template>
  <div class="control-input">
    <label :for="`input${$uid}`" v-if="props.label">
      {{ label }}
    </label>
    <input
      :id="`input${$uid}`"
      :type="props.type"
      :value="props.modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

defineOptions({ name: 'ControlInput' });

const emit = defineEmits(['update:modelValue']);
const $uid = getCurrentInstance().uid;

const props = defineProps({
  modelValue: { type: [String, Number] },
  type: { type: String, required: true },
  label: { type: String, default: null },
});
</script>

<style lang="scss" src="./ControlInput.scss">
</style>
