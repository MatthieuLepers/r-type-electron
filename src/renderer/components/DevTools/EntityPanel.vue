<template>
  <Transition name="appear">
    <aside class="entity-panel" v-if="State.entity">
      <div class="entity-panel__container">
        <h1 class="entity-panel__container-title">
          ID
        </h1>
        <div class="entity-panel__container-content">
          {{ State.entity.components?.sprite?.id }}
        </div>
      </div>

      <div class="entity-panel__container">
        <h2 class="entity-panel__container-title">
          Tags
        </h2>
        <ul class="entity-panel__tags">
          <li
            v-for="(tag, i) in State.entity.tags"
            :key="i"
            class="entity-panel__tag"
          >
            {{ tag }}
          </li>
        </ul>
      </div>

      <div class="entity-panel__container" v-if="State.entity.components?.locomotor?.path?.length">
        <h2 class="entity-panel__container-title">
          Path
        </h2>
        <div class="entity-panel__container-content">
          {{ State.entity.components.locomotor.path }}
        </div>
        <div class="entity-panel__container-actions">
          <MaterialButton
            :icon="devToolStore.actions.isPathShown(State.entity) ? 'icon-eye-slash' : 'icon-eye'"
            :modifiers="{
              secondary: !devToolStore.actions.isPathShown(State.entity),
              danger: devToolStore.actions.isPathShown(State.entity),
            }"
            @click="devToolStore.actions.toggleShowPath(State.entity)"
          />
        </div>
      </div>

      <DynamicComponent
        v-for="component in Object.keys(State.entity.components).sort()"
        :key="component"
        :component="component"
      />

      <MaterialButton
        class="entity-panel__close"
        icon="icon-close"
        :modifiers="{ danger: true }"
        title="Close"
        @click="devToolStore.actions.toggleShow(State.entity)"
      />
    </aside>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

import MaterialButton from '@renderer/components/Materials/Button/index.vue';
import DynamicComponent from '@renderer/components/DevTools/Components/index.vue';

import { devToolStore } from '@renderer/core/stores/DevToolsStore';

const State = computed(() => ({
  entity: devToolStore.state.selectedEntity,
}));
</script>

<style lang="scss" src="./EntityPanel.scss">
</style>
