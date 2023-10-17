<template>
  <ContextMenu :visible="props.visible">
    <ContextMenuSeparator />
    <ContextMenuItem
      :label="t('App.TitleBarMenu.fileMenu.exit')"
      :shortcut="plateform === 'darwin' ? 'Cmd+Q' : 'Alt+F4'"
      @click="actions.closeApp"
    />
  </ContextMenu>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import ContextMenu from '@renderer/components/Materials/ContextMenu/index.vue';
import ContextMenuItem from '@renderer/components/Materials/ContextMenu/Item.vue';
import ContextMenuSeparator from '@renderer/components/Materials/ContextMenu/Separator.vue';

defineOptions({ name: 'AppTitleBarFileMenu' });

const { t } = useI18n();
const { plateform } = api;

const props = defineProps({
  visible: { type: Boolean, required: true },
  name: { type: String, required: true },
});

const actions = {
  closeApp() {
    api.send(`close:${props.name}`);
  },
};
</script>
