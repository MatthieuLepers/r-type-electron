<template>
  <div class="devtools-entities">
    <ul>
      <li
        v-for="(entity, i) in State.entities"
        :key="i"
      >
        <DevToolsEntity :entity="entity" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import DevToolsEntity from '@renderer/components/DevTools/Entity.vue';

import Global from '@renderer/core/stores/AppStore';

defineOptions({ name: 'DevToolsEntities' });

const State = computed(() => ({
  entities: Object.values(Global.Game?.entities ?? {}),
}));
</script>

<style lang="scss" src="./EntitiesTab.scss">
</style>
