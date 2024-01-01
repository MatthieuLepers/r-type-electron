<template>
  <MainLayout class="path-editor-screen">
    <Screen>
      <template v-slot:content>
        <PathEditor />
      </template>
      <template v-slot:footer>
        <ScreenMenuButton
          :to="{ name: 'MenuTools' }"
          :modifiers="{ tiny: true }"
        >
          Back
        </ScreenMenuButton>
      </template>
    </Screen>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@renderer/views/MainLayout.vue';
import PathEditor from '@renderer/components/PathEditor/index.vue';
import Screen from '@renderer/components/Screen/index.vue';
import ScreenMenuButton from '@renderer/components/Screen/MenuButton.vue';

defineOptions({ name: 'MenuPathEditorToolScreen' });
</script>
