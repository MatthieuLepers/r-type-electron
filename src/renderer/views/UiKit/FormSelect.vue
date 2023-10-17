<template>
  <section class="flexy flexy--gutter">
    <div class="flexy__col flexy__col--1of2">
      <MaterialFormSelect
        v-model="state.modelValue"
        label="Select test"
        :required="state.required"
        :disabled="state.disabled"
        :variant="state.variant"
        :valid="state.valid"
        :searchable="state.searchable"
        :inputPlaceholder="state.inputPlaceholder"
        :messages="state.messages"
        :options="state.options"
        :dropdownPosition="state.dropdownPosition"
        :allowRemoveSelected="state.allowRemoveSelected"
        @keydown-enter="actions.handleAddOption"
      >
        <template
          v-if="state.searchable"
          v-slot:empty="{ search, reset }"
        >
          <button type="button" @click="actions.handleAddOption(search, reset)">
            Ajouter l'option « {{ search }} »
          </button>
        </template>
      </MaterialFormSelect>
    </div>
    <div class="flexy__col flexy__col--1of2">
      <MaterialFormFieldSet legend="Booleans">
        <MaterialFormFieldLine :size="3">
          <template v-slot:field0>
            <MaterialFormToggle v-model="state.required" label="Required ?" />
          </template>
          <template v-slot:field1>
            <MaterialFormToggle v-model="state.disabled" label="Disabled ?" />
          </template>
          <template v-slot:field2>
            <MaterialFormToggle v-model="state.searchable" label="Searchable ?" />
          </template>
        </MaterialFormFieldLine>
        <MaterialFormFieldLine :size="3">
          <template v-slot:field0>
            <MaterialFormToggle v-model="state.allowRemoveSelected" label="Removable selected ?" />
          </template>
          <template v-slot:field1>
            <MaterialFormToggle v-model="state.multiple" label="Multiple ?" />
          </template>
        </MaterialFormFieldLine>
      </MaterialFormFieldSet>

      <MaterialFormFieldSet legend="Style">
      <MaterialFormFieldLine :size="3">
        <template v-slot:field0>
          <MaterialFormRadio v-model="state.variant" name="variant" value="default" label="Default" />
        </template>
        <template v-slot:field1>
          <MaterialFormRadio v-model="state.variant" name="variant" value="box" label="Box" />
        </template>
      </MaterialFormFieldLine>
      </MaterialFormFieldSet>

      <MaterialFormFieldSet legend="Valid state">
        <MaterialFormFieldLine :size="3">
          <template v-slot:field0>
            <MaterialFormRadio v-model="state.valid" name="valid" :value="null" label="N/A" />
          </template>
          <template v-slot:field1>
            <MaterialFormRadio v-model="state.valid" name="valid" :value="true" label="Yes" />
          </template>
          <template v-slot:field2>
            <MaterialFormRadio v-model="state.valid" name="valid" :value="false" label="No" />
          </template>
        </MaterialFormFieldLine>
      </MaterialFormFieldSet>

      <MaterialFormFieldSet legend="Messages">
        <MaterialFormFieldLine :size="3">
          <template v-slot:field0>
            <MaterialFormCheckbox v-model="state.messages" value="apple" name="messages" label="Pomme" />
          </template>
          <template v-slot:field1>
            <MaterialFormCheckbox v-model="state.messages" value="cherry" name="messages" label="Cerise" />
          </template>
          <template v-slot:field2>
            <MaterialFormCheckbox v-model="state.messages" value="peach" name="messages" label="Pêche" />
          </template>
        </MaterialFormFieldLine>
      </MaterialFormFieldSet>

      <MaterialFormFieldLine v-if="state.searchable">
        <MaterialFormInput v-model="state.inputPlaceholder" label="Placeholder" />
      </MaterialFormFieldLine>
    </div>
  </section>
</template>

<script setup>
import { reactive, watch } from 'vue';

import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormFieldSet from '@renderer/components/Materials/Form/FieldSet.vue';
import MaterialFormToggle from '@renderer/components/Materials/Form/Toggle.vue';
import MaterialFormSelect from '@renderer/components/Materials/Form/Select.vue';
import MaterialFormCheckbox from '@renderer/components/Materials/Form/Checkbox.vue';
import MaterialFormRadio from '@renderer/components/Materials/Form/Radio.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';

const state = reactive({
  modelValue: null,
  required: false,
  disabled: false,
  variant: 'default',
  valid: null,
  messages: [],
  searchable: false,
  inputPlaceholder: null,
  dropdownPosition: 'bottom',
  allowRemoveSelected: false,
  options: [],
  multiple: false,
});

const actions = {
  handleAddOption(text, resetFn) {
    if (!state.options.find((o) => o.label === text)) {
      state.options.push({ value: text, label: text });
      state.modelValue = state.multiple
        ? (state.modelValue === null ? [text] : [...state.modelValue, text])
        : text
      ;
    }
    resetFn();
  },
};

watch(() => state.multiple, (newVal) => {
  state.modelValue = newVal
    ? (state.modelValue === null ? [] : [state.modelValue])
    : state.modelValue
  ;
});
</script>
