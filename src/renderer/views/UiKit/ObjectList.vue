<template>
  <section class="flexy flexy--gutter">
    <div class="flexy__col flexy__col--1of2">
      <MaterialFormObjectList
        v-model="state.options"
        :title="state.title"
        :model="state.model"
        :min="parseInt(state.min, 10)"
        :max="parseInt(state.max, 10)"
      >
        <template v-slot="{ model }">
          <MaterialFormFieldLine :size="2">
            <template v-slot:field0>
              <MaterialFormInput
                v-model="model.label"
                type="text"
                label="Label"
                :required="true"
              />
            </template>
            <template v-slot:field1>
              <MaterialFormInput
                v-model="model.value"
                type="text"
                label="Value"
                :required="true"
              />
            </template>
          </MaterialFormFieldLine>
        </template>
      </MaterialFormObjectList>
    </div>
    <div class="flexy__col flexy__col--1of2">
      <MaterialFormFieldSet legend="Limits">
        <MaterialFormFieldLine :size="2">
          <template v-slot:field0>
            <MaterialFormInput
              v-model="state.min"
              type="number"
              label="Min."
            />
          </template>
          <template v-slot:field1>
            <MaterialFormInput
              v-model="state.max"
              type="number"
              label="Max. (0 = ignore)"
            />
          </template>
        </MaterialFormFieldLine>
      </MaterialFormFieldSet>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue';

import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormFieldSet from '@renderer/components/Materials/Form/FieldSet.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';
import MaterialFormObjectList from '@renderer/components/Materials/Form/ObjectList.vue';

const state = reactive({
  title: 'Object list test',
  model: {
    label: null,
    value: null,
  },
  options: [{ label: 'Zéro', value: '0' }],
  min: 1,
  max: 0,
});
</script>