<template>
  <div class="menu-settings-screen">
    <Screen title="Settings">
      <template v-slot:content>
        <nav
          class="menu-settings-screen__navigation"
          @mousewheel="actions.handleMouseWheel"
        >
          <ScreenMenuButton :to="{ name: 'MenuSettingsGameplay' }">
            Gameplay
          </ScreenMenuButton>
          <ScreenMenuButton :to="{ name: 'MenuSettingsKeyboard' }">
            Keyboard
          </ScreenMenuButton>
          <ScreenMenuButton :to="{ name: 'MenuSettingsAudio' }">
            Audio
          </ScreenMenuButton>
        </nav>
        <section class="menu-settings-screen__view">
          <router-view />
        </section>
      </template>
      <template v-slot:footer>
        <ScreenMenuButton
          :to="{ name: 'Menu' }"
          :modifiers="{ tiny: true }"
        >
          Back
        </ScreenMenuButton>
      </template>
    </Screen>
  </div>
</template>

<script setup>
import Screen from '@renderer/components/Screen/index.vue';
import ScreenMenuButton from '@renderer/components/Screen/MenuButton.vue';

defineOptions({ name: 'MenuSettingsScreen' });

const actions = {
  handleMouseWheel(e) {
    const direction = e.deltaY > 0 ? 1 : -1;
    if (e.target.matches('.menu-settings-screen__navigation') ?? e.target.closest('.menu-settings-screen__navigation')) {
      const target = e.target.closest('.menu-settings-screen__navigation') ?? e.target;
      target.scrollTop += 60 * direction;
    }
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
