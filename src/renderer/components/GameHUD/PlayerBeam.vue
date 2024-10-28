<template>
  <div class="player-beam">
    <span class="player-beam__thumb" :style="{ width: `${state.beamPercent}%` }" />
    <span class="player-beam__absorbsion-thumb" :style="{ width: `${state.absorbsionPercent}%` }" />
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

import PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';

defineOptions({ name: 'PlayerBeam' });

const props = defineProps({
  player: { type: PlayerShip },
});

const state = reactive({
  beamPercent: 0,
  absorbsionPercent: 0,
});

const actions = {
  onModuleAbsorb(e) {
    state.absorbsionPercent = e.details.percent;
  },
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
      actions.setupEvents(e.details.player);
    });
    player.on('attachEntity', (e) => {
      if (e.details.entity.hasTag('module', '!bitModule')) {
        e.details.entity.on('absorbsionProgress', actions.onModuleAbsorb);
        state.absorbsionPercent = e.details.entity.absorbsionProgress;
      }
    });
    player.on('detachEntity', (e) => {
      if (e.details.entity.hasTag('module', '!bitModule')) {
        e.details.entity.off('absorbsionProgress', actions.onModuleAbsorb);
        state.absorbsionPercent = 0;
      }
    });
  },
};

onMounted(() => {
  actions.setupEvents(props.player);
});
</script>

<style lang="scss" src="./PlayerBeam.scss">
</style>
