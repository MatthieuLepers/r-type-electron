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

import { devToolStore } from '@renderer/core/stores/DevToolsStore';

const State = computed(() => {
  const entity = devToolStore.state.selectedEntity;
  const component = entity.components.attachedentities;

  return {
    entity,
    component,
  };
});
</script>
