<template>
  <div class="game-hud">
    <div class="player-lives">
      <img
        v-for="i in Array(state.lives)"
        :key="i"
        :src="image('img/gui/try.png')"
        alt=""
      />
    </div>
    <div class="player-score" data-player="P1">
      Score: <span>{{ state.score }}</span>
    </div>
    <PlayerBeam
      v-for="(player, i) in Global.Game.getPlayerList()"
      :key="i"
      :player="player"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

import PlayerBeam from '@renderer/components/GameHUD/PlayerBeam.vue';

import Global from '@renderer/core/stores/AppStore';
import { image } from '@renderer/core/utils';

defineOptions({ name: 'GameHud' });

const state = reactive({
  score: 0,
  lives: 2,
});

const actions = {
  setupEvent(player) {
    player.on('dead', () => {
      state.lives = Math.max(0, state.lives - 1);
    });

    player.on('respawn', (e) => {
      actions.setupEvent(e.details.player);
    });
  },
};

onMounted(() => {
  Global.Game.on('scoreUpdate', (e) => {
    state.score = e.details.board.score;
  });
  actions.setupEvent(Global.Game.entities.player1);
});
</script>

<style lang="scss" src="./index.scss">
</style>
