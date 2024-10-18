<template>
  <div class="entity-card" v-bind="$attrs">
    <component
      :is="!!State.attached.length ? 'button' : 'div'"
      class="entity-card__outer"
      @click="actions.handleShowAttachedEntities"
    >
      <h3 class="entity-card__title">
        {{ props.entity.components?.sprite?.id }}
        <div v-if="State.attached.length" class="entity-card__title__attached">
          (with {{ State.attached.length }} attached entit{{ State.attached.length > 1 ? 'ies' : 'y' }})
        </div>
      </h3>
      <div class="entity-card__actions">
        <MaterialButton
          title="Show on canvas"
          :icon="useDevToolStore.actions.isShown(props.entity) ? 'icon-eye-slash' : 'icon-eye'"
          :modifiers="{
            secondary: !useDevToolStore.actions.isShown(props.entity),
            danger: useDevToolStore.actions.isShown(props.entity),
          }"
          @click.stop="useDevToolStore.actions.toggleShow(props.entity)"
        />
      </div>
    </component>
  </div>
  <ul class="entity-card__inner" v-show="state.open">
    <li v-for="(entity, i) in State.attached" :key="i">
      <EntityCard :entity="entity" class="entity-card__attached" />
    </li>
  </ul>
</template>

<script setup>
import { reactive, computed } from 'vue';

import MaterialButton from '@renderer/components/Materials/Button/index.vue';

import { useDevToolStore } from '@renderer/core/stores/DevToolsStore';

const props = defineProps({
  entity: { type: Object, required: true },
});

const state = reactive({
  open: false,
});

const State = computed(() => ({
  attached: Object.values(props.entity.components?.attachedentities?.entities ?? {}),
}));

const actions = {
  handleShowAttachedEntities() {
    if (State.value.attached.length) {
      state.open = !state.open;
    }
  },
};

</script>

<style lang="scss" src="./EntityCard.scss">
</style>
