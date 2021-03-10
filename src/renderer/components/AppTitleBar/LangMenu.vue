<template>
  <ContextMenu :visible="visible">
    <ContextMenuItem
      v-for="([lang, iso], i) in Object.entries(langList)"
      :key="i"
      :label="$t(`TitleBarMenu.langMenu.${lang}`)"
      :icon="iso === value ? 'check' : ''"
      @click="handleSetLocale(iso)"
    />
  </ContextMenu>
</template>

<script>
import ContextMenu from '@/components/UI/ContextMenu/index';
import ContextMenuItem from '@/components/UI/ContextMenu/Item';

export default {
  name: 'AppTitleBarLangMenu',
  components: { ContextMenu, ContextMenuItem },
  props: {
    value: { type: String, required: true },
    visible: { type: Boolean, required: true },
  },
  computed: {
    langList() {
      return {
        english: 'en-EN',
        french: 'fr-FR',
      };
    },
  },
  methods: {
    handleSetLocale(iso) {
      this.$root.$i18n.locale = iso;
      this.$emit('input', iso);
      this.$emit('close');
    },
  },
};
</script>
