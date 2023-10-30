<template>
  <div class="devtools-entities">
    <ul class="devtools-entities__list">
      <li
        v-for="(entity, i) in State.entities"
        :key="i"
      >
        <component
          :is="actions.hasAttachedEntities(entity) ? 'button' : 'span'"
          :class="{
            'devtools-entities__button': actions.hasAttachedEntities(entity),
            'devtools-entities__button--open': actions.hasAttachedEntities(entity) && state.open.includes(entity.getId()),
          }"
          @click="actions.toggleOpen(entity)"
        >
          <DevToolsEntity :entity="entity" />
        </component>
        <DevToolsAttachedEntities
          v-if="actions.hasAttachedEntities(entity)"
          :entity="entity"
          :open="state.open.includes(entity.getId())"
          class="devtools-entities__sub"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import {
  reactive,
  computed,
  watch,
  onBeforeMount,
} from 'vue';

import DevToolsEntity from '@renderer/components/DevTools/Entity.vue';
import DevToolsAttachedEntities from '@renderer/components/DevTools/EntityAttachedEntities.vue';

import Global from '@renderer/core/stores/AppStore';

defineOptions({ name: 'DevToolsEntities' });

const state = reactive({
  open: [],
  entities: Object.values(Global?.Game?.entities ?? {}),
});

const State = computed(() => ({
  entities: state.entities.filter((entity) => !entity.attachedTo),
}));

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

watch(() => Global, (newGlobal) => {
  state.entities = Object.values(newGlobal?.Game?.entities ?? {});
}, { deep: true });

onBeforeMount(() => {
  api.on('updateEntities', (entities) => {
    console.log(entities);
  });
});
</script>

<style lang="scss" src="./EntitiesTab.scss">
</style>
