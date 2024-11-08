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
          on <span class="entity-panel__tag">{{ event }}</span> event ({{ listenerCount }})
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

const props = defineProps({
  entity: { type: Object, required: true },
});

const State = computed(() => ({
  component: props.entity.components.eventemitter,
}));
</script>
