<template>
  <div class="MenuModsScreen">
    <Screen title="Mods">
      <template v-slot:content>
        <div class="MenuModsScreenNavigation" @mousewheel="handleMouseWheel">
          <button v-for="(mod, i) in Object.values(modList)" :key="i" :class="`MenuModsScreenNavigationButton ${selected === mod ? 'MenuModsScreenNavigationButton--selected' : ''}`">
            <img :src="getModIcon(mod)" :alt="mod.name" />
            <div>
              {{ mod.name }}
              <span v-if="mod.$crashed">(Crashed!)</span>
            </div>
            <input type="checkbox" :checked="mod.$enabled && !mod.$crashed" />
          </button>
        </div>
        <div class="MenuModsScreenContainer">
          <h2>{{ selected.name }}</h2>
          <p>{{ selected.desc }}</p>
        </div>
      </template>
      <template v-slot:footer>
        <ScreenMenuButton :to="{ name: 'Menu' }" variant="tiny">
          Back
        </ScreenMenuButton>
      </template>
    </Screen>
  </div>
</template>

<script>
import Global from '@/js/stores/AppStore';
import Screen from '@/components/Screen/index';
import ScreenMenuButton from '@/components/Screen/MenuButton';

export default {
  name: 'MenuModsScreen',
  components: { Screen, ScreenMenuButton },
  data() {
    return {
      selected: null,
    };
  },
  computed: {
    modList() {
      return Object.values(Global.ModKnowledge.modList);
    },
  },
  methods: {
    handleMouseWheel(e) {
      const direction = e.deltaY > 0 ? 1 : -1;
      if (e.target.matches('.MenuModsScreenNavigation') || e.target.closest('.MenuModsScreenNavigation')) {
        const target = e.target.closest('.MenuModsScreenNavigation') || e.target;
        target.scrollTop += 60 * direction;
      }
    },
    getModIcon(mod) {
      return mod.icon || 'static/img/gui/module.png';
    },
  },
  created() {
    [this.selected] = this.modList;
  },
};
</script>

<style lang="scss" src="./Mods.scss">
</style>
