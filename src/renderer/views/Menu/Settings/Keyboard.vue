<template>
  <div class="menu-settings-keyboard-screen">
    <MaterialTabs
      v-model="state.currentTab"
      :tabs="State.tabs"
      class="menu-settings-keyboard-screen__tabs"
    >
      <template v-slot:game>
        <MaterialFormFieldLine
          v-for="([label, control], i) in Object.entries(state.gameControls)"
          :key="i"
        >
          <MaterialFormInput
            type="text"
            v-model="control.key"
            :label="label"
            variant="inline"
            @keyup="actions.handleKeyPress($event, control)"
          />
        </MaterialFormFieldLine>
      </template>
      <template v-slot:debug>
        <MaterialFormFieldLine
          v-for="([label, control], i) in Object.entries(state.debugControls)"
          :key="i"
        >
          <MaterialFormInput
            type="text"
            v-model="control.key"
            :label="label"
            variant="inline"
            @keyup="actions.handleKeyPress($event, control)"
          />
        </MaterialFormFieldLine>
      </template>
    </MaterialTabs>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';

import MaterialTabs from '@renderer/components/Materials/Tabs/index.vue';
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
  'CHARGE',
  'MODULE',
  'PAUSE',
];

const DEBUG_CONTROLS = [
  'DEV_TOOLS',
  'DEBUG_TOGGLE_DRAW_HITBOXES',
  'DEBUG_TOGGLE_DRAW_QUADTREE',
  'DEBUG_TOGGLE_DRAW_PATHLINES',
  'DEBUG_TOGGLE_DRAW_HEALTH_BARS',
];

const state = reactive({
  gameControls: EDITABLE_CONTROLS.reduce((acc, key) => ({
    ...acc,
    [key]: Global.Settings.controls[key],
  }), {}),
  debugControls: DEBUG_CONTROLS.reduce((acc, key) => ({
    ...acc,
    [key]: Global.Settings.controls[key],
  }), {}),
  currentTab: 'game',
});

const State = computed(() => ({
  tabs: {
    game: { label: 'Game' },
    debug: { label: 'Debug' },
  },
}));

const actions = {
  handleKeyPress(e, control) {
    control.key = e.key;
  },
};
</script>
