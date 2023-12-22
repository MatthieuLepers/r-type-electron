<template>
  <div class="menu-settings-keyboard-screen">
    <MaterialFormFieldLine
      v-for="([label, control], i) in Object.entries(state.controls)"
      :key="i"
    >
      <MaterialFormInput
        type="text"
        v-model="control.key"
        :label="label"
        variant="inline"
        @keypress.prevent.stop="actions.handleKeyPress($event, control)"
      />
    </MaterialFormFieldLine>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

import MaterialFormFieldLine from '@renderer/components/Materials/Form/FieldLine.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';

import Global from '@renderer/core/stores/AppStore';

defineOptions({ name: 'MenuSettingsKeyboardScreen' });

const EDITABLE_CONTROLS = [
  'UP',
  'LEFT',
  'DOWN',
  'RIGHT',
  'SHOOT',
  'MODULE',
  'PAUSE',
];

const state = reactive({
  controls: EDITABLE_CONTROLS.reduce((acc, key) => ({
    ...acc,
    [key]: Global.Settings.controls[key],
  }), {}),
});

const actions = {
  handleKeyPress(e, control) {
    control.key = e.key;
  },
};
</script>

<style lang="scss" src="./Keyboard.scss">
</style>
