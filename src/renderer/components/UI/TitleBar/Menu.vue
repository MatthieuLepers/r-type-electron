<template>
  <div class="TitleBarMenuCtn">
    <ul class="TitleBarMenu">
      <TitleBarMenuItem :id="menuName" :label="$t(`TitleBarMenu.${menuName}.label`)" @click="toggleMenu(menuName)" v-for="(menuName, i) in menuList" :key="`menu${i}`">
        <slot :name="menuName" :visible="menuName === activeMenu" :close="closeMenu" />
      </TitleBarMenuItem>
    </ul>
  </div>
</template>

<script>
import TitleBarMenuItem from './MenuItem';

export default {
  name: 'TitleBarMenu',
  components: { TitleBarMenuItem },
  props: {
    menuList: { type: Array, default: () => [] },
  },
  data() {
    return {
      activeMenu: null,
    };
  },
  methods: {
    handleWindowClick(e) {
      if (!e.target.matches('.TitleBarMenuCtn') && !e.target.closest('.TitleBarMenuCtn') && e.target !== this.$el) {
        this.activeMenu = null;
        window.removeEventListener('click', this.handleWindowClick);
      }
    },
    toggleMenu(menu) {
      if (this.activeMenu === menu) {
        this.activeMenu = null;
      } else {
        this.activeMenu = menu;
        window.addEventListener('click', this.handleWindowClick);
      }
    },
    closeMenu() {
      this.activeMenu = null;
    },
  },
};
</script>

<style lang="scss" src="./Menu.scss">
</style>
