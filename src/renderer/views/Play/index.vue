<template>
  <MainLayout class="play-screen">
    <canvas ref="canvas" />
    <Screen
      title="Paused!"
      v-show="state.paused"
    >
      <template v-slot:content>
        <button
          :class="GenerateModifiers('screen-menu-button', { xxl: true })"
          @click="actions.handleClickResume"
        >
          Resume
        </button>
        <button
          :class="GenerateModifiers('screen-menu-button', { xxl: true })"
          @click="actions.handleClickExitToMenu"
        >
          Exit to menu
        </button>
        <MaterialFormInput
          v-model="state.fxVolume"
          type="range"
          :label="`Fx volume ${state.fxVolume}%`"
        />
        <MaterialFormInput
          v-model="state.ambientVolume"
          type="range"
          :label="`Ambient volume ${state.ambientVolume}%`"
        />
      </template>
    </Screen>
    <GameHUD v-if="state.game" />
    <DevTools v-show="state.devToolsOpen" />
  </MainLayout>
</template>

<script setup>
import {
  reactive,
  ref,
  watch,
  onMounted,
} from 'vue';
import { useRouter } from 'vue-router';

import MainLayout from '@renderer/views/MainLayout.vue';
import Screen from '@renderer/components/Screen/index.vue';
import GameHUD from '@renderer/components/GameHUD/index.vue';
import DevTools from '@renderer/components/DevTools/index.vue';
import MaterialFormInput from '@renderer/components/Materials/Form/Input.vue';

import Global from '@renderer/core/stores/AppStore';
import Game from '@renderer/core/Game';

defineOptions({ name: 'PlayScreen' });

const canvas = ref(null);

const router = useRouter();

const state = reactive({
  game: null,
  devToolsOpen: false,
  paused: false,
  ambientVolume: Global.Settings.audio.ambientVolume,
  fxVolume: Global.Settings.audio.fxVolume,
});

const actions = {
  handleClickResume() {
    Global.Engine.resume();
  },
  handleClickExitToMenu() {
    Global.Game.reset();
    router.push({ name: 'Menu' });
  },
};

watch(() => state.fxVolume, (newVal) => {
  Global.Settings.audio.fxVolume = newVal;
});

watch(() => state.ambientVolume, (newVal) => {
  Global.Settings.audio.ambientVolume = newVal;
});

onMounted(() => {
  state.game = new Game(canvas.value);
  state.game.start();

  Global.Engine.on('paused', () => {
    if (!state.devToolsOpen) {
      state.paused = true;
    }
  });
  Global.Engine.on('resumed', () => {
    state.paused = false;
  });
  Global.Game.on('devTools', (e) => {
    state.devToolsOpen = e.details.enabled;
    Global.devToolsOpen = state.devToolsOpen;
    Global.Engine.debug = state.devToolsOpen;
  });

  api.on('toggleDebugPause', (paused) => {
    Global.Engine.debug = paused;
  });
});
</script>

<style lang="scss" src="./index.scss">
</style>
