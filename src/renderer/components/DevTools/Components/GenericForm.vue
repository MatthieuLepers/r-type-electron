<template>
  <template
    v-for="([fieldKey, fieldValue]) in Object.entries(state.component)"
    :key="fieldKey"
  >
    <GenericForm
      v-if="actions.getFieldType(fieldKey) === 'Object'"
      :component="fieldValue"
      :formData="props.formData[fieldKey]"
    />
    <MaterialFormFieldLine
      v-else-if="actions.getFieldType(fieldKey) === 'Boolean'"
      :modifiers="{ row: true, end: true }"
    >
      <MaterialFormToggle
        v-model="state.component[fieldKey]"
        v-bind="props.formData[fieldKey]?.props ?? {}"
        v-on="props.formData[fieldKey]?.events ?? []"
        direction="right"
      />
    </MaterialFormFieldLine>
    <MaterialFormFieldLine
      v-else-if="actions.getFieldType(fieldKey) === 'Number'"
    >
      <MaterialFormInput
        v-model.number="state.component[fieldKey]"
        v-bind="props.formData[fieldKey]?.props ?? {}"
        v-on="props.formData[fieldKey]?.events ?? []"
        variant="inline"
      />
    </MaterialFormFieldLine>
    <MaterialFormFieldLine
      v-else-if="actions.getFieldType(fieldKey) === 'String'"
    >
      <MaterialFormInput
        v-model.lazy="state.component[fieldKey]"
        v-bind="props.formData[fieldKey]?.props ?? {}"
        v-on="props.formData[fieldKey]?.events ?? []"
        variant="inline"
      />
    </MaterialFormFieldLine>
  </template>
</template>

<script setup>
import { reactive, watch } from 'vue';

import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormToggle from '@renderer/components/Materials/Form/Toggle.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';

defineOptions({ name: 'GenericForm' });

const props = defineProps({
  formData: { type: Object, default: () => ({}) },
  component: { type: Object, required: true },
});

const state = reactive({
  component: props.component,
});

const actions = {
  getFieldType(fieldName) {
    if ([null, undefined].includes(state.component[fieldName])) {
      return props.formData?.[fieldName]?.type ?? state.component[fieldName];
    }
    return Object.getPrototypeOf(state.component[fieldName]).constructor.name;
  },
};

watch(() => props.component, (newVal) => {
  state.component = newVal;
}, { deep: true });
</script>
