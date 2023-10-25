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
      </template>
    </Screen>
    <GameHUD v-if="state.game" />
    <Console v-show="state.consoleOpen" />
  </MainLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import MainLayout from '@renderer/views/MainLayout.vue';
import Screen from '@renderer/components/Screen/index.vue';
import GameHUD from '@renderer/components/GameHUD/index.vue';
import Console from '@renderer/components/Console/index.vue';

import Global from '@renderer/core/stores/AppStore';
import Game from '@renderer/core/Game';

defineOptions({ name: 'PlayScreen' });

const canvas = ref(null);

const router = useRouter();

const state = reactive({
  game: null,
  consoleOpen: false,
  paused: false,
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

onMounted(() => {
  state.game = new Game(canvas.value);
  state.game.start();

  Global.Engine.on('paused', () => {
    if (!state.consoleOpen) {
      state.paused = true;
    }
  });
  Global.Engine.on('resumed', () => {
    state.paused = false;
  });
  Global.Game.on('devConsole', () => {
    state.consoleOpen = !state.consoleOpen;
    Global.consoleOpen = state.consoleOpen;
    Global.Engine.paused = state.consoleOpen;
  });
});
</script>

<style lang="scss" src="./index.scss">
</style>
