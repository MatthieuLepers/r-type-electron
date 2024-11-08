<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) Locomotor
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
  component: props.entity.components.locomotor,
}));

const form = {
  canMove: {
    props: {
      label: 'Can move ?',
    },
  },
  followSlope: {
    props: {
      label: 'Follow slope ?',
    },
  },
  speed: {
    x: {
      props: {
        label: 'Speed X',
      },
    },
    y: {
      props: {
        label: 'Speed Y',
      },
    },
  },
  path: {
    type: 'String',
    props: {
      label: 'SVG Path',
      placeholder: 'M0,100L0,200',
    },
  },
};
</script>
