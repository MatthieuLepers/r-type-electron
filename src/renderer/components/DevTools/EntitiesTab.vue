<template>
  <div class="devtools-entities">
    <MaterialFormFieldLine>
      <MaterialFormInput
        v-model="state.search"
        type="search"
        placeholder="Search entity by id or tag"
      />
    </MaterialFormFieldLine>

    <ul class="devtools-entities__card-list">
      <li
        v-for="(entity, i) in State.entities"
        :key="i"
        class="devtools-entities__card-list-item"
      >
        <EntityCard :entity="entity" />
      </li>
    </ul>

    <EntityPanel />
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';

import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';
import EntityCard from '@renderer/components/DevTools/EntityCard.vue';
import EntityPanel from '@renderer/components/DevTools/EntityPanel.vue';

import { devToolStore } from '@renderer/core/stores/DevToolsStore';

defineOptions({ name: 'DevToolsEntitiesTab' });

const state = reactive({
  search: '',
});

const State = computed(() => ({
  entities: devToolStore.state.entities
    .filter((entity) => !entity.tags.includes('attached')
      && (entity.components?.sprite?.id?.includes(state.search)
        || entity.tags.some((tag) => tag.includes(state.search)))),
}));

api.on('reset', () => {
  devToolStore.state.entities = [];
  devToolStore.state.debugPause = false;
});
api.on('onEntitySpawn', (e) => {
  const entity = JSON.parse(e);
  devToolStore.state.entities.push(entity);
});
api.on('onEntityDespawn', (entityId) => {
  devToolStore.state.entities = devToolStore.state.entities
    .filter((entity) => entity.components?.sprite?.id !== entityId)
  ;
});
</script>

<style lang="scss" src="./EntitiesTab.scss">
</style>
