<template>
  <main class="menu-tools-screen">
    <Screen title="Tools">
      <template v-slot:footer>
        <ScreenMenuButton
          :to="{ name: 'Menu' }"
          :modifiers="{ tiny: true }"
        >
          Back
        </ScreenMenuButton>
      </template>
    </Screen>
  </main>
</template>

<script setup>
import Screen from '@renderer/components/Screen/index.vue';
import ScreenMenuButton from '@renderer/components/Screen/MenuButton.vue';

defineOptions({ name: 'MenuToolsScreen' });
</script>
