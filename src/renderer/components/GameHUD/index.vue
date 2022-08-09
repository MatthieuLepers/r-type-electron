<template>
  <div class="GameHUD">
    <div class="PlayerScore"></div>
    <div class="PlayerBeam">
      <span :style="{ width: `${beamPercent}%` }"></span>
    </div>
  </div>
</template>

<script>
import Global from '@/assets/js/stores/AppStore';

export default {
  name: 'GameHUD',
  data() {
    return {
      beamPercent: 0,
      player: Global.Game.entities.player1,
    };
  },
  mounted() {
    this.setupEvents(this.player);
  },
  methods: {
    setupEvents(player) {
      player.on('chargeProgress', (e) => {
        this.beamPercent = e.details.percent;
      });
      player.on('chargeStop', () => {
        this.beamPercent = 0;
      });
      player.on('dead', () => {
        this.beamPercent = 0;
      });
      player.on('respawn', (e) => {
        this.setupEvents(e.details.player);
      });
    },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
