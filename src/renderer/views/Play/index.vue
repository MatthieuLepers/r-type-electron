<template>
  <div class="PlayScreen">
    <canvas ref="canvas"></canvas>
    <Screen title="Paused!" v-show="paused">
      <template v-slot:content>
        <button class="ScreenMenuButton ScreenMenuButton--xxl ScreenMenuButton--auto" @click="handleClickResume">Resume</button>
        <button class="ScreenMenuButton ScreenMenuButton--xxl ScreenMenuButton--auto" @click="handleClickExitToMenu">Exit to menu</button>
      </template>
    </Screen>
  </div>
</template>

<script>
import Global from '@/assets/js/stores/AppStore';
import Game from '@/assets/js/Game';

import Screen from '@/components/Screen/index';

export default {
  name: 'PlayScreen',
  components: { Screen },
  data() {
    return {
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
    const game = new Game(this.$refs.canvas);
    game.start();

    Global.Engine.on('paused', () => { this.paused = true; });
    Global.Engine.on('resumed', () => { this.paused = false; });
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
