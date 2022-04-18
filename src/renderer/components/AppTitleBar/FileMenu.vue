<template>
  <ContextMenu :visible="visible">
    <ContextMenuSeparator />
    <ContextMenuItem
      :label="$t('App.TitleBarMenu.fileMenu.exit')"
      shortcut="Alt+F4"
      @click="closeApp"
    />
  </ContextMenu>
</template>

<script>
import { remote } from 'electron';

import ContextMenu from '@/components/Materials/ContextMenu/index';
import ContextMenuItem from '@/components/Materials/ContextMenu/Item';
import ContextMenuSeparator from '@/components/Materials/ContextMenu/Separator';

export default {
  name: 'AppTitleBarFileMenu',
  components: { ContextMenu, ContextMenuItem, ContextMenuSeparator },
  props: {
    visible: { type: Boolean, required: true },
  },
  methods: {
    closeApp() {
      remote.getCurrentWindow().close();
    },
  },
};
</script>
