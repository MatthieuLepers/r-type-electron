<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) Charged Shooter
    </h2>
    <div class="entity-panel__container-content">
      <MaterialFormFieldLine :modifiers="{ row: true, end: true }">
        <MaterialFormToggle
          v-model="State.component.automatic"
          label="Automatic ?"
          direction="right"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model="State.component.chargeTime"
          label="Charge time"
          type="number"
          variant="inline"
          :min="1"
          :step="1"
          :iconData="{ text: 'ms' }"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          label="Projectile class"
          variant="inline"
          :modelValue="State.component.projectile"
          :readonly="true"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <MaterialFormInput
          v-model="State.component.shootProbability"
          label="Shoot probability"
          type="number"
          variant="inline"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine :modifiers="{ row: true, end: true }">
        <MaterialFormToggle
          v-model="State.component.requireTarget"
          label="Require target ?"
          direction="right"
        />
      </MaterialFormFieldLine>
      <MaterialFormFieldLine>
        <EntityCard
          v-if="State.component.target"
          :entity="State.component.target"
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
import EntityCard from '@renderer/components/DevTools/EntityCard.vue';

import { devToolStore } from '@renderer/core/stores/DevToolsStore';

const State = computed(() => {
  const entity = devToolStore.state.selectedEntity;
  const component = entity.components.chargedshooter;

  return {
    entity,
    component,
  };
});
</script>
