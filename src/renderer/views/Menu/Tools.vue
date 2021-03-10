<template>
  <div class="MenuToolsScreen">
    <Screen title="Tools">
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
  name: 'MenuToolsScreen',
  components: { Screen, ScreenMenuButton },
};
</script>
