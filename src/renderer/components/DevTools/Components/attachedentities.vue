<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) Attached Entities
    </h2>
    <div class="entity-panel__container-content">
      <MaterialFormFieldLine
        v-for="(entity, i) in State.component.entities"
        :key="i"
      >
        <EntityCard :entity="entity" />
      </MaterialFormFieldLine>
      <em v-if="Object.keys(State.component.entities).length <= 0">
        No attached entities
      </em>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import EntityCard from '@renderer/components/DevTools/EntityCard.vue';

const props = defineProps({
  entity: { type: Object, required: true },
});

const State = computed(() => ({
  component: props.entity.components.attachedentities,
}));
</script>
