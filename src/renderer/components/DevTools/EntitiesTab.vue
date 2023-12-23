<template>
  <div class="devtools-entities">
    <MaterialFormFieldLine>
      <MaterialFormToggle
        v-model="state.debugPause"
        label="Debug Pause"
      />
    </MaterialFormFieldLine>
    <MaterialFormFieldLine>
      <MaterialFormInput
        v-model="state.search"
        type="search"
        placeholder="Search entity by id or tag"
      />
    </MaterialFormFieldLine>

    <MaterialDataTable
      :columns="State.columns"
      :data="State.entities"
      :allowMoveFn="() => false"
    >
      <template v-slot:id="{ obj }">
        <span :title="obj.id">
          {{ obj.id }}
        </span>
      </template>
      <template v-slot:attachedTo="{ obj }">
        <MaterialDataTableButton
          :icon="state.show.includes(obj.id) ? 'icon-eye-slash' : 'icon-eye'"
          :modifiers="{
            round: true,
            secondary: !state.show.includes(obj.id),
            danger: state.show.includes(obj.id),
          }"
          @click="actions.handleToggleShowDebugDraw(obj)"
        />
      </template>
    </MaterialDataTable>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue';

import MaterialDataTable from '@renderer/components/Materials/DataTable/index.vue';
import MaterialDataTableButton from '@renderer/components/Materials/DataTable/Button.vue';
import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';
import MaterialFormToggle from '@renderer/components/Materials/Form/Toggle.vue';

defineOptions({ name: 'DevToolsEntities' });

const props = defineProps({
  entities: { type: Object, default: () => ({}) },
});

const state = reactive({
  entities: props.entities,
  search: '',
  debugPause: false,
  show: [],
});

const State = computed(() => ({
  entities: Object
    .values(state.entities)
    .filter((entity) => entity.id.includes(state.search) || entity.tags.some((tag) => tag.includes(state.search))),
  columns: {
    id: { label: 'Identifiant', className: 'id' },
    attachedTo: { className: 'show' },
  },
}));

const actions = {
  handleToggleShowDebugDraw(entity) {
    if (state.show.includes(entity.id)) {
      state.show = state.show.filter((id) => id !== entity.id);
      api.invoke('sendDataToWindow', 'main', 'entityRemoveDebugComponent', entity.id);
    } else {
      state.show.push(entity.id);
      api.invoke('sendDataToWindow', 'main', 'entityAddDebugComponent', entity.id);
    }
  },
};

watch(() => props.entities, (newVal) => {
  state.entities = newVal;
});

watch(() => state.show.length, async (newVal) => {
  if (newVal === 0 && !state.debugPause) {
    await api.invoke('sendDataToWindow', 'main', 'toggleDebugPause', false);
  } else {
    await api.invoke('sendDataToWindow', 'main', 'toggleDebugPause', true);
  }
});

watch(() => state.debugPause, (newVal) => {
  api.invoke('sendDataToWindow', 'main', 'toggleDebugPause', newVal);
});
</script>

<style lang="scss" src="./EntitiesTab.scss">
</style>
