<template>
  <ContextMenu :visible="visible">
    <ContextMenuSeparator />
    <ContextMenuItem
      :label="$t('TitleBarMenu.fileMenu.exit')"
      shortcut="Alt+F4"
      @click="closeApp"
    />
  </ContextMenu>
</template>

<script>
import { remote } from 'electron';

import ContextMenu from '@/components/UI/ContextMenu/index';
import ContextMenuItem from '@/components/UI/ContextMenu/Item';
import ContextMenuSeparator from '@/components/UI/ContextMenu/Separator';

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
