<template>
  <MainLayout class="play-screen">
    <canvas ref="canvas" />
    <Screen
      title="Game Over!"
      v-show="state.gameOver"
    >
      <template v-slot:content>
        <span>Score: {{ state.score }}</span>
        <button
          :class="GenerateModifiers('screen-menu-button', { xxl: true })"
          @click="actions.handleClickExitToMenu"
        >
          Exit to menu
        </button>
      </template>
    </Screen>
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

        <div class="menu-sliders flexy flexy--gutter">
          <div class="flexy flexy__col flexy__col--1of2 menu-slider">
            <span class="menu-slider__label">
              Fx volume {{ state.fxVolume }}%
            </span>
            <VueSlider
              v-model="state.fxVolume"
              tooltip="none"
              class="flexy__col flexy__col--full"
            />
          </div>

          <div class="flexy flexy__col flexy__col--1of2 menu-slider">
            <span class="menu-slider__label">
              Ambient volume {{ state.ambientVolume }}%
            </span>
            <VueSlider
              v-model="state.ambientVolume"
              tooltip="none"
              class="flexy__col flexy__col--full"
            />
          </div>
        </div>
      </template>
    </Screen>
    <GameHUD v-if="state.game" />
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
import VueSlider from 'vue-3-slider-component';

import MainLayout from '@renderer/views/MainLayout.vue';
import Screen from '@renderer/components/Screen/index.vue';
import GameHUD from '@renderer/components/GameHUD/index.vue';

import Global from '@renderer/core/stores/AppStore';
import Game from '@renderer/core/Game';

defineOptions({ name: 'PlayScreen' });

const canvas = ref(null);

const router = useRouter();

const state = reactive({
  game: null,
  gameOver: false,
  paused: false,
  ambientVolume: Global.Settings.audio.ambientVolume,
  fxVolume: Global.Settings.audio.fxVolume,
  score: 0,
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
  api.sendSync('openDevTools');
  state.game = new Game(canvas.value);
  state.game.start();

  Global.Engine.on('paused', () => {
    state.paused = true;
  });
  Global.Engine.on('resumed', () => {
    state.paused = false;
  });
  Global.Game.on('devTools', (e) => {
    Global.devToolsOpen = e.details.enabled;
    Global.Engine.debug = e.details.enabled;
  });
  Global.Game.on('gameOver', () => {
    state.gameOver = true;
  });
  Global.Game.on('scoreUpdate', (e) => {
    state.score = e.details.board.score;
  });

  api.on('toggleDebugPause', (paused) => {
    Global.Engine.debug = paused;
  });
});
</script>

<style lang="scss" src="./index.scss">
</style>
