<template>
  <TitleBar
    :name="props.name"
    :maximizable="false"
    :showHelp="false"
  >
    <template v-slot:menu="{ windowName }">
      <TitleBarMenu :menuList="State.menuList">
        <template #fileMenu="{ visible, close }">
          <AppTitleBarFileMenu :visible="visible" :name="windowName" @close="close" />
        </template>
        <template #langMenu="{ visible, close }">
          <AppTitleBarLangMenu :visible="visible" @close="close" />
        </template>
        <template #toolsMenu="{ visible, close }">
          <AppTitleBarToolsMenu :visible="visible" @close="close" />
        </template>
      </TitleBarMenu>
    </template>
  </TitleBar>
</template>

<script setup>
import { computed } from 'vue';

import TitleBar from '@renderer/components/Materials/TitleBar/index.vue';
import TitleBarMenu from '@renderer/components/Materials/TitleBar/Menu.vue';
import AppTitleBarFileMenu from '@renderer/components/AppTitleBar/FileMenu.vue';
import AppTitleBarLangMenu from '@renderer/components/AppTitleBar/LangMenu.vue';
import AppTitleBarToolsMenu from '@renderer/components/AppTitleBar/ToolsMenu.vue';

defineOptions({ name: 'AppTitleBar' });

const props = defineProps({
  name: { type: String, required: true },
});

const State = computed(() => ({
  menuList: ['fileMenu', 'langMenu'],
}));
</script>
