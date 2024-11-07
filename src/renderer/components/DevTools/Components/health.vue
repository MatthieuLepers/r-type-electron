<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) Health
    </h2>
    <div class="entity-panel__container-content">
      <MaterialFormFieldLine :modifiers="{ row: true, end: true }">
        <MaterialFormToggle
          v-model="State.component.invincible"
          label="Invincible ?"
          direction="right"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model="State.component.maxHealth"
          label="Max health"
          type="number"
          variant="inline"
          :min="1"
          :step="1"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model="State.component.health"
          label="Health"
          type="number"
          variant="inline"
          :min="1"
          :max="State.component.maxHealth"
          :step="1"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model="State.component.absorbsion"
          label="Absorbsion"
          type="number"
          variant="inline"
          :min="0"
          :step="1"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model="State.component.damages"
          label="Hull damages"
          type="number"
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
  component: props.entity.components.health,
}));
</script>
