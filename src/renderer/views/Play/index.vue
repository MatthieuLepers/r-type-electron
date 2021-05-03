<template>
  <div class="PlayScreen">
    <canvas ref="canvas"></canvas>
    <Screen title="Paused!" v-show="paused">
      <template v-slot:content>
        <button class="ScreenMenuButton ScreenMenuButton--xxl ScreenMenuButton--auto" @click="handleClickResume">Resume</button>
        <ScreenMenuButton :to="{ name: 'Menu' }">Exit to menu</ScreenMenuButton>
      </template>
    </Screen>
  </div>
</template>

<script>
import Global from '@/js/stores/AppStore';
import Game from '@/js/Game';
import Screen from '@/components/Screen/index';
import ScreenMenuButton from '@/components/Screen/MenuButton';

export default {
  name: 'PlayScreen',
  components: { Screen, ScreenMenuButton },
  data() {
    return {
      paused: false,
    };
  },
  methods: {
    handleClickResume() {
      Global.Engine.resume();
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
