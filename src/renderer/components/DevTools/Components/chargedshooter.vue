<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) Charged Shooter
    </h2>
    <div class="entity-panel__container-content">
      <GenericForm
        :formData="form"
        :component="State.component"
      />
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
import EntityCard from '@renderer/components/DevTools/EntityCard.vue';
import GenericForm from '@renderer/components/DevTools/Components/GenericForm.vue';

const props = defineProps({
  entity: { type: Object, required: true },
});

const State = computed(() => ({
  component: props.entity.components.chargedshooter,
}));

const form = {
  automatic: {
    props: {
      label: 'Automatic ?',
    },
  },
  chargeTime: {
    props: {
      label: 'Charge time',
      type: 'number',
      variant: 'inline',
      min: 1,
      step: 1,
      iconData: {
        text: 'ms',
      },
    },
  },
  projectile: {
    props: {
      label: 'Projectile class',
      readonly: true,
    },
  },
  shootProbability: {
    props: {
      label: 'Shoot probability',
      type: 'number',
      variant: 'inline',
      min: 0,
      max: 1,
      step: 0.01,
    },
  },
  requireTarget: {
    props: {
      label: 'Require target ?',
    },
  },
};
</script>
