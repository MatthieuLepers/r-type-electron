<template>
  <div class="entity-panel__container">
    <h2 class="entity-panel__container-title">
      (Component) Event Emitter
    </h2>
    <div class="entity-panel__container-content">
      Listening to:
      <ul>
        <li
          v-for="(listenerCount, event) in State.component.listeners"
          :key="event"
        >
          on <span :style="{
            display: 'inline-block',
            backgroundColor: '#555',
            borderRadius: '4px',
            padding: '0 2px',
          }">{{ event }}</span> event ({{ listenerCount }})
        </li>
      </ul>
      <em v-if="Object.keys(State.component.listeners).length <= 0">
        No event listeners
      </em>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { devToolStore } from '@renderer/core/stores/DevToolsStore';

const State = computed(() => {
  const entity = devToolStore.state.selectedEntity;
  const component = entity.components.eventemitter;

  return {
    entity,
    component,
  };
});
</script>
