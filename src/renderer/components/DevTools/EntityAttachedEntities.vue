<template>
  <ul :class="GenerateModifiers('devtools-entities-attachedentities', { open: props.open })">
    <li
      v-for="(entity, i) in Object.values(props.entity.getAttachedEntities())"
      :key="i"
      class="devtools-entities-attachedentities__item"
    >
      <component
        :is="actions.hasAttachedEntities(entity) ? 'button' : 'span'"
        :class="{
          'devtools-entities-attachedentities__button': actions.hasAttachedEntities(entity),
          'devtools-entities-attachedentities__button--open': actions.hasAttachedEntities(entity) && state.open.includes(entity.getId()),
        }"
        @click="actions.toggleOpen(entity)"
      >
        <DevToolsEntities :entity="entity" />
      </component>
      <DevToolsEntityAttachedEntity
        v-if="actions.hasAttachedEntities(entity)"
        :entity="entity"
        :open="state.open.includes(entity.getId())"
        class="devtools-entities-attachedentities__sub"
      />
    </li>
  </ul>
</template>

<script setup>
import { reactive } from 'vue';

import DevToolsEntities from '@renderer/components/DevTools/Entity.vue';

defineOptions({ name: 'DevToolsEntityAttachedEntity' });

const props = defineProps({
  entity: { type: Object, required: true },
  open: { type: Boolean, default: false },
});

const state = reactive({
  open: [],
});

const actions = {
  hasAttachedEntities(entity) {
    return entity.hasComponent('AttachedEntities') && Object.values(entity.getAttachedEntities()).length;
  },
  toggleOpen(entity) {
    if (state.open.includes(entity.getId())) {
      state.open = state.open.filter((entityId) => entityId !== entity.getId());
    } else {
      state.open.push(entity.getId());
    }
  },
};
</script>

<style lang="scss" src="./EntityAttachedEntity.scss">
</style>
