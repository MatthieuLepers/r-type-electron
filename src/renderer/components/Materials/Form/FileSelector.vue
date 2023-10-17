<template>
  <div class="m-form-file-selector">
    <input
      class="m-form-file-selector__input"
      type="file"
      ref="input"
      :multiple="props.multiple"
      :name="props.name"
      @change="emit('input', Array.from($event.target.files))"
    />
    <MaterialButton
      class="m-form-file-selector__button"
      icon="icon-import"
      :disabled="props.disabled"
      @click.stop="actions.handleClick"
    >
      {{ props.label }}
    </MaterialButton>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import MaterialButton from '@renderer/components/Materials/Button/index.vue';

defineOptions({ name: 'FormFileSelector' });

const emit = defineEmits(['input']);

const input = ref(null);

const props = defineProps({
  value: { type: [Array, String], required: true },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: null },
  name: { type: String, default: null },
});

const actions = {
  handleClick() {
    input.value.click();
  },
};
</script>

<style lang="scss" src="./FileSelector.scss">
</style>
