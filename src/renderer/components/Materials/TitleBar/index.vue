<template>
  <nav class="m-title-bar">
    <slot name="menu" :windowName="props.name" />

    <div class="m-title-bar__app" v-if="props.appTitle">
      {{ props.appTitle }}
    </div>
    <div class="m-title-bar__button-ctn">
      <button
        v-if="props.showHelp"
        type="button"
        class="m-title-bar__button"
        @click="emit('help')"
      >
        <span class="icon-help"></span>
      </button>
      <button
        v-if="props.minimizable"
        type="button"
        class="m-title-bar__button"
        @click="actions.minimize"
      >
        <span class="icon-minimize"></span>
      </button>
      <button
        v-if="props.maximizable || props.minimizable"
        :disabled="!props.maximizable"
        class="m-title-bar__button"
        @click="actions.maximize">
        <span class="icon-maximize"></span>
      </button>
      <button
        v-if="props.closable"
        :class="GenerateModifiers('m-title-bar__button', { close: true })"
        @click="actions.close"
      >
        <span class="icon-close"></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
defineOptions({ name: 'TitleBar' });

const emit = defineEmits(['help']);

const props = defineProps({
  name: { type: String, required: true },
  minimizable: { type: Boolean, default: true },
  maximizable: { type: Boolean, default: true },
  closable: { type: Boolean, default: true },
  showHelp: { type: Boolean, default: true },
  appTitle: { type: String, default: null },
});

const actions = {
  minimize() {
    api.send(`minimize:${props.name}`);
  },
  maximize() {
    api.send(`maximize:${props.name}`);
  },
  close() {
    api.send(`close:${props.name}`);
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
