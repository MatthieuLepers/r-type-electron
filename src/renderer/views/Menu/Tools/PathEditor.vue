<template>
  <MainLayout class="path-editor-screen">
    <PathEditor />
  </MainLayout>
</template>

<script setup>
import MainLayout from '@renderer/views/MainLayout.vue';
import PathEditor from '@renderer/components/PathEditor/index.vue';

defineOptions({ name: 'MenuPathEditorToolScreen' });
</script>
