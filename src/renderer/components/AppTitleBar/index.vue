<template>
  <TitleBar :btnMaximize="false" :btnHelp="false">
    <template v-slot:menu>
      <TitleBarMenu :menuList="menuList">
        <template v-slot:fileMenu="{ visible, close }">
          <AppTitleBarFileMenu :visible="visible" @close="close" />
        </template>
        <template v-slot:langMenu="{ visible, close }">
          <AppTitleBarLangMenu v-model="currentLocale" :visible="visible" @close="close" />
        </template>
      </TitleBarMenu>
    </template>
  </TitleBar>
</template>

<script>
import TitleBar from '@/components/UI/TitleBar/index';
import TitleBarMenu from '@/components/UI/TitleBar/Menu';

import AppTitleBarFileMenu from './FileMenu';
import AppTitleBarLangMenu from './LangMenu';

export default {
  name: 'AppTitleBar',
  components: { TitleBar, TitleBarMenu, AppTitleBarFileMenu, AppTitleBarLangMenu },
  data() {
    return {
      currentLocale: 'fr-FR',
    };
  },
  computed: {
    menuList() {
      return ['fileMenu', 'langMenu'];
    },
  },
};
</script>
