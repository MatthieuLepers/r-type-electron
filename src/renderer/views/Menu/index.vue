<template>
  <MainLayout class="menu-screen">
    <Screen v-if="!State.isLoaded" title="Loading ressources">
      <template v-slot:content>
        <div class="menu-screen__progressbar">
          <progress :value="state.percent" max="100"></progress>
          {{ state.currentRessource.bank }}
        </div>
      </template>
    </Screen>
    <Screen v-else>
      <template v-slot:content>
        <ScreenMenuButton :to="{ name: 'Play' }" class="menu-screen__play-button">
          {{ $t('Views.Menu.play') }}
          <span class="animated-border animated-border--fst" />
          <span class="animated-border animated-border--snd" />
          <span class="animated-border animated-border--trd" />
        </ScreenMenuButton>
        <div class="menu-screen__button-container">
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
  </MainLayout>
</template>

<script setup>
import {
  reactive,
  computed,
  watch,
  onMounted,
} from 'vue';

import MainLayout from '@renderer/views/MainLayout.vue';
import Screen from '@renderer/components/Screen/index.vue';
import ScreenMenuButton from '@renderer/components/Screen/MenuButton.vue';

import Global from '@renderer/core/stores/AppStore';
import RessourceLoader from '@renderer/core/stores/RessourceLoader';

defineOptions({ name: 'MenuScreen' });

const state = reactive({
  percent: 0,
  currentRessource: {},
});

const State = computed(() => ({
  isLoaded: Global.loaded || state.percent >= 100,
}));

watch(() => State.value.isLoaded, (newVal) => {
  if (newVal) {
    Global.loaded = newVal;
  }
});

onMounted(() => {
  api.invoke('sendDataToWindow', 'devTools', 'reset');
  RessourceLoader.on('ressourceLoad', (e) => {
    state.currentRessource = e.details.ressource;
    state.percent = e.details.percent;
  });
});
</script>

<style lang="scss" src="./index.scss">
</style>
