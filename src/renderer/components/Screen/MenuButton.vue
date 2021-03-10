<template>
  <router-link :to="to" v-slot="{ navigate }" custom>
    <button :class="`ScreenMenuButton ScreenMenuButton--${variant} ScreenMenuButton--${align} ${isActive ? 'ScreenMenuButton--active' : ''}`" @click="navigate">
      <slot />
    </button>
  </router-link>
</template>

<script>
export default {
  name: 'ScreenMenuButton',
  props: {
    to: { type: [String, Object], required: true },
    variant: { type: String, default: 'xxl' },
    align: { type: String, default: 'auto' },
  },
  computed: {
    isActive() {
      return this.$route.name === this.to.name;
    },
  },
};
</script>

<style lang="scss" src="./MenuButton.scss">
</style>
