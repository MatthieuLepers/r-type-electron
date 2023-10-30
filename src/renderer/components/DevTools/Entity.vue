<template>
  <div class="devtools-entity">
    {{ props.entity.getId() }}

    <MaterialFormToggle
      v-model="state.show"
      label="Show"
    />
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

import MaterialFormToggle from '@renderer/components/Materials/Form/Toggle.vue';

import Global from '@renderer/core/stores/AppStore';
import Debug from '@renderer/core/classes/components/Debug';

defineOptions({ name: 'DevToolsEntity' });

const props = defineProps({
  entity: { type: Object, required: true },
});

const state = reactive({
  show: false,
});

watch(() => state.show, (newVal) => {
  if (newVal) {
    if (!props.entity.hasComponent('Debug')) {
      props.entity.addComponent(Debug);
    }
    props.entity.addTag('debug');
  } else {
    if (props.entity.hasComponent('Debug')) {
      Global.Game.canvasObj.removeDrawable(props.entity.components.debug);
      props.entity.removeComponent('Debug');
    }
    props.entity.removeTag('debug');
  }
});
</script>

<style lang="scss" src="./Entity.scss">
</style>
