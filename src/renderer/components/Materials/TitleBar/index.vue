<template>
  <nav class="TitleBar">
    <slot name="menu" />

    <div class="TitleBarApp" v-if="appTitle">
      {{ appTitle }}
    </div>
    <div class="TitleBarButtonCtn">
      <button v-if="btnHelp" class="TitleBarButton" @click="$emit('help')">
        <i class="icon-help"></i>
      </button>
      <button v-if="btnMinimize" class="TitleBarButton" @click="minimize">
        <i class="icon-minimize"></i>
      </button>
      <button v-if="btnMaximize || btnMinimize" :disabled="!btnMaximize" class="TitleBarButton" @click="maximize">
        <i class="icon-maximize"></i>
      </button>
      <button v-if="btnClose" class="TitleBarButton" @click="close">
        <i class="icon-close"></i>
      </button>
    </div>
  </nav>
</template>

<script>
import { remote } from 'electron';

export default {
  name: 'TitleBar',
  props: {
    btnMinimize: { type: Boolean, default: true },
    btnMaximize: { type: Boolean, default: true },
    btnClose: { type: Boolean, default: true },
    btnHelp: { type: Boolean, default: true },
    appTitle: { type: String, default: null },
  },
  data() {
    return {
      window: remote.getCurrentWindow(),
    };
  },
  methods: {
    minimize() {
      this.window.minimize();
    },
    maximize() {
      if (this.window.isMaximized()) {
        this.window.unmaximize();
      } else {
        this.window.maximize();
      }
    },
    close() {
      if (process.env.NODE_ENV === 'development' && this.window.isDevToolsOpened()) {
        this.window.closeDevTools();
      }
      this.window.close();
    },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
