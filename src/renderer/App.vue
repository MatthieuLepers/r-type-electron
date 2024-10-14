<template>
  <router-view v-if="!state.loading" />
  <MaterialLoaderIcon
    v-else
    class="app__loader"
  />
  <MaterialNotificationList>
    <template #downloadupdate="{ notification }">
      {{ notification.text }}
      <MaterialProgressBar
        class="app__progress-bar"
        :percent="state.percent"
      />
    </template>
  </MaterialNotificationList>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import MaterialLoaderIcon from '@renderer/components/Materials/Loader/Icon.vue';
import MaterialProgressBar from '@renderer/components/Materials/ProgressBar/index.vue';
import MaterialNotificationList from '@renderer/components/Materials/Notification/List.vue';

import { notificationStore } from '@renderer/components/Materials/Notification/Store';
import { settingsStore } from '@renderer/core/entities/setting/store';
import Shortcut from '@renderer/core/Shortcut';

const { t, locale } = useI18n();

const state = reactive({
  loading: true,
  percent: 0,
});

api.on('localeChange', (iso) => {
  locale.value = iso;
});

api.on('runShortcut', (shortcut) => {
  if (shortcut in Shortcut) {
    Shortcut[shortcut]();
  }
});

const updateAvailableNotification = {
  id: 'downloadupdate',
  type: 'info',
  text: t('App.Updater.downloadingUpdate'),
  delay: 0,
  action: {
    callback() {
      notificationStore.actions.removeNotification(updateAvailableNotification);
    },
    icon: 'icon-close',
  },
};

api.on('update-available', () => {
  notificationStore.actions.pushRawNotification(updateAvailableNotification);
});

api.on('download-progress', (percent) => {
  state.percent = percent / 100;
});

api.on('update-downloaded', () => {
  const notification = {
    type: 'success',
    text: t('App.Updater.readyToInstall'),
    delay: 0,
    action: {
      callback() {
        api.sendSync('quitAndInstallUpdate');
      },
      label: t('App.Updater.quitAndInstall'),
      icon: 'icon-export',
    },
  };
  notificationStore.actions.removeNotification(updateAvailableNotification);
  notificationStore.actions.pushRawNotification(notification);
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
