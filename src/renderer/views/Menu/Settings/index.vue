<template>
  <div class="MenuSettingsScreen">
    <Screen title="Settings">
      <template v-slot:content>
        <nav class="MenuSettingsScreenNavigation" @mousewheel="handleMouseWheel">
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
        <section class="MenuSettingsScreenView">
          <router-view />
        </section>
      </template>
      <template v-slot:footer>
        <ScreenMenuButton :to="{ name: 'Menu' }" variant="tiny">
          Back
        </ScreenMenuButton>
      </template>
    </Screen>
  </div>
</template>

<script>
import Screen from '@/components/Screen/index';
import ScreenMenuButton from '@/components/Screen/MenuButton';

export default {
  name: 'MenuSettingsScreen',
  components: { Screen, ScreenMenuButton },
  methods: {
    handleMouseWheel(e) {
      const direction = e.deltaY > 0 ? 1 : -1;
      if (e.target.matches('.MenuSettingsScreenNavigation') || e.target.closest('.MenuSettingsScreenNavigation')) {
        const target = e.target.closest('.MenuSettingsScreenNavigation') || e.target;
        target.scrollTop += 60 * direction;
      }
    },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
