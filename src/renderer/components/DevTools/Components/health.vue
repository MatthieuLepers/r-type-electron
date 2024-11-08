<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) Health
    </h2>
    <div class="entity-panel__container-content">
      <GenericForm
        :formData="form"
        :component="State.component"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import GenericForm from '@renderer/components/DevTools/Components/GenericForm.vue';

const props = defineProps({
  entity: { type: Object, required: true },
});

const State = computed(() => ({
  component: props.entity.components.health,
}));

const form = {
  invincible: {
    props: {
      label: 'Invincible ?',
    },
  },
  maxHealth: {
    props: {
      label: 'Max health',
      type: 'number',
      min: 1,
    },
  },
  health: {
    props: {
      label: 'Health',
      type: 'number',
      min: 1,
      max: State.value.component.maxHealth,
    },
  },
  absorbsion: {
    props: {
      label: 'Absorbsion',
      type: 'number',
      min: 0,
    },
  },
  damages: {
    props: {
      label: 'Hull damages',
      type: 'number',
      min: 0,
    },
  },
};
</script>
