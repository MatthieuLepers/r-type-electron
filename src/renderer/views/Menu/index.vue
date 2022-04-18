<template>
  <div class="MenuScreen">
    <Screen v-if="!isLoaded" title="Loading ressources">
      <template v-slot:content>
        <div class="MenuScreenProgressBar">
          <progress :value="percent" max="100"></progress>
          {{ currentRessource.bank }}
        </div>
      </template>
    </Screen>
    <Screen v-else>
      <template v-slot:content>
        <ScreenMenuButton :to="{ name: 'Play' }" class="MenuScreenPlayButton">
          {{ $t('Views.Menu.play') }}
          <span class="AnimatedBorder AnimatedBorder--fst"></span>
          <span class="AnimatedBorder AnimatedBorder--snd"></span>
          <span class="AnimatedBorder AnimatedBorder--trd"></span>
        </ScreenMenuButton>
        <div class="MenuScreenButtonContainer">
          <ScreenMenuButton :to="{ name: 'MenuSettingsGameplay' }">
            {{ $t('Views.Menu.settings') }}
          </ScreenMenuButton>
          <ScreenMenuButton :to="{ name: 'MenuMods' }">
            {{ $t('Views.Menu.mods') }}
          </ScreenMenuButton>
          <ScreenMenuButton :to="{ name: 'MenuTools' }">
            {{ $t('Views.Menu.tools') }}
          </ScreenMenuButton>
        </div>
      </template>
    </Screen>
  </div>
</template>

<script>
import Global from '@/assets/js/stores/AppStore';
import RessourceLoader from '@/assets/js/stores/RessourceLoader';

import Screen from '@/components/Screen/index';
import ScreenMenuButton from '@/components/Screen/MenuButton';

export default {
  name: 'MenuScreen',
  components: { Screen, ScreenMenuButton },
  data() {
    return {
      percent: 0,
      currentRessource: {},
    };
  },
  mounted() {
    RessourceLoader.on('ressourceLoad', (e) => {
      this.currentRessource = e.details.ressource;
      this.percent = e.details.percent;
    });
  },
  computed: {
    isLoaded() {
      return Global.loaded || this.percent >= 100;
    },
  },
  watch: {
    isLoaded(val) {
      if (val) {
        Global.loaded = true;
      }
    },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
