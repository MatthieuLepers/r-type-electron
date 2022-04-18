<template>
  <div id="app">
    <AppTitleBar />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import App from '@/assets/js/App';
import ModManager from '@/assets/js/classes/ModManager';
import Global from '@/assets/js/stores/AppStore';

import AppTitleBar from '@/components/AppTitleBar/index';

export default {
  name: 'RTypeWeb',
  components: { AppTitleBar },
  data() {
    return Object.freeze({
      Global,
      app: new App(),
    });
  },
  async created() {
    const modManager = new ModManager();
    Global.ModKnowledge = await modManager.loadMods();
    await this.app.loadRessources();
  },
};
</script>

<style lang="scss" src="./assets/scss/style.scss">
</style>
