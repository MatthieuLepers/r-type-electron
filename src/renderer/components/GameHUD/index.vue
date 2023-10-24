<template>
  <div class="game-hud">
    <div class="player-score" />
    <div class="player-beam">
      <span :style="{ width: `${state.beamPercent}%` }" />
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

import Global from '@renderer/core/stores/AppStore';

defineOptions({ name: 'GameHud' });

const state = reactive({
  beamPercent: 0,
});

const actions = {
  setupEvents(player) {
    player.on('chargeProgress', (e) => {
      state.beamPercent = e.details.percent;
    });
    player.on('chargeStop', () => {
      state.beamPercent = 0;
    });
    player.on('dead', () => {
      state.beamPercent = 0;
    });
    player.on('respawn', (e) => {
      state.setupEvents(e.details.player);
    });
  },
};

onMounted(() => {
  actions.setupEvents(Global.Game.entities.player1);
});
</script>

<style lang="scss" src="./index.scss">
</style>
