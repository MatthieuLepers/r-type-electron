<template>
  <aside class="entity-panel" v-if="props.entity">
    <div class="entity-panel__container">
      <h1 class="entity-panel__container-title">
        ID
      </h1>
      <div class="entity-panel__container-content">
        {{ props.entity.components?.sprite?.id }}
      </div>
    </div>

    <div class="entity-panel__container">
      <h2 class="entity-panel__container-title">
        Tags
      </h2>
      <ul class="entity-panel__tags">
        <li
          v-for="(tag, i) in props.entity.tags"
          :key="i"
          class="entity-panel__tag"
        >
          {{ tag }}
        </li>
      </ul>
    </div>

    <div class="entity-panel__container" v-if="props.entity.components?.locomotor?.path?.length">
      <h2 class="entity-panel__container-title">
        Path
      </h2>
      <div class="entity-panel__container-content">
        {{ props.entity.components.locomotor.path }}
      </div>
      <div class="entity-panel__container-actions">
        <MaterialButton
          :icon="devToolStore.actions.isPathShown(props.entity) ? 'icon-eye-slash' : 'icon-eye'"
          :modifiers="{
            secondary: !devToolStore.actions.isPathShown(props.entity),
            danger: devToolStore.actions.isPathShown(props.entity),
          }"
          @click="devToolStore.actions.toggleShowPath(props.entity)"
        />
      </div>
    </div>

    <DynamicComponent
      v-for="component in Object.keys(props.entity.components).sort()"
      :key="component"
      :component="component"
      :entity="props.entity"
    />

    <MaterialButton
      class="entity-panel__close"
      icon="icon-close"
      :modifiers="{ danger: true }"
      title="Close"
      @click="devToolStore.actions.toggleShow(props.entity)"
    />
  </aside>
</template>

<script setup>
import MaterialButton from '@renderer/components/Materials/Button/index.vue';
import DynamicComponent from '@renderer/components/DevTools/Components/index.vue';

import { devToolStore } from '@renderer/core/stores/DevToolsStore';

const props = defineProps({
  entity: { type: Object, required: true },
});
</script>

<style lang="scss" src="./EntityPanel.scss">
</style>
