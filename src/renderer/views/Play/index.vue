<template>
  <div class="PlayScreen">
    <canvas ref="canvas"></canvas>
    <Screen title="Paused!" v-show="paused">
      <template v-slot:content>
        <button :class="GenerateModifiers('ScreenMenuButton', { xxl: true, auto: true })" @click="handleClickResume">Resume</button>
        <button :class="GenerateModifiers('ScreenMenuButton', { xxl: true, auto: true })" @click="handleClickExitToMenu">Exit to menu</button>
      </template>
    </Screen>
    <GameHUD v-if="game" />
    <Console v-show="consoleOpen" />
  </div>
</template>

<script>
import Global from '@/assets/js/stores/AppStore';
import Game from '@/assets/js/Game';

import Screen from '@/components/Screen/index';
import GameHUD from '@/components/GameHUD/index';
import Console from '@/components/Console/index';

export default {
  name: 'PlayScreen',
  components: { Screen, GameHUD, Console },
  data() {
    return {
      game: null,
      consoleOpen: false,
      paused: false,
    };
  },
  methods: {
    handleClickResume() {
      Global.Engine.resume();
    },
    handleClickExitToMenu() {
      Global.Game.reset();
      this.$router.push({ name: 'Menu' });
    },
  },
  mounted() {
    this.game = new Game(this.$refs.canvas);
    this.game.start();

    Global.Engine.on('paused', () => { this.paused = true; });
    Global.Engine.on('resumed', () => { this.paused = false; });
    Global.Game.on('devConsole', () => {
      this.consoleOpen = !this.consoleOpen;
      Global.Engine.paused = this.consoleOpen;
    });
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
