<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) Locomotor
    </h2>
    <div class="entity-panel__container-content">
      <MaterialFormFieldLine :modifiers="{ row: true, end: true }">
        <MaterialFormToggle
          v-model="State.component.canMove"
          label="Can move ?"
          direction="right"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine :modifiers="{ row: true, end: true }">
        <MaterialFormToggle
          v-model="State.component.followSlope"
          label="Follow slope ?"
          direction="right"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model="State.component.speed.x"
          label="Speed X"
          type="number"
          variant="inline"
          :min="0"
          :step="1"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model="State.component.speed.y"
          label="Speed Y"
          type="number"
          variant="inline"
          :min="0"
          :step="1"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model.lazy="State.component.path"
          label="Path"
          variant="inline"
          :min="0"
          :step="1"
        />
      </MaterialFormFieldLine>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormToggle from '@renderer/components/Materials/Form/Toggle.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';

const props = defineProps({
  entity: { type: Object, required: true },
});

const State = computed(() => ({
  component: props.entity.components.locomotor,
}));
</script>
