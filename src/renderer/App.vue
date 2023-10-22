<template>
  <router-view v-if="!state.loading" />
  <MaterialLoaderIcon
    v-else
    class="app__loader"
  />
  <MaterialNotificationList />
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import MaterialLoaderIcon from '@renderer/components/Materials/Loader/Icon.vue';
import MaterialNotificationList from '@renderer/components/Materials/Notification/List.vue';

import { settingsStore } from '@renderer/core/entities/setting/store';
import Shortcut from '@renderer/core/Shortcut';

const { locale } = useI18n();

const state = reactive({
  loading: true,
});

api.on('localeChange', (iso) => {
  locale.value = iso;
});

api.on('runShortcut', (shortcut) => {
  if (shortcut in Shortcut) {
    Shortcut[shortcut]();
  }
});

onBeforeMount(() => {
  api.on('database-ready', async () => {
    await settingsStore.actions.load();

    await api.invoke('localeChange', settingsStore.actions.getString('locale'));
    locale.value = settingsStore.actions.getString('locale');

    state.loading = false;
  });
});
</script>

<style lang="scss" src="~styles/style.scss">
</style>
