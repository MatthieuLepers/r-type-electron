<template>
  <div class="PlayScreen">
    <canvas ref="canvas"></canvas>
    <ScreenMenuButton :to="{ name: 'Menu' }">Back to menu</ScreenMenuButton>
  </div>
</template>

<script>
import ScreenMenuButton from '@/components/Screen/MenuButton';
import Game from '@/js/Game';

export default {
  name: 'PlayScreen',
  components: { ScreenMenuButton },
  mounted() {
    const game = new Game(this.$refs.canvas);
    game.start();
  },
};
</script>
