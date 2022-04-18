<template>
  <router-link :to="to" v-slot="{ navigate }" custom>
    <button :class="GenerateModifiers('ScreenMenuButton', { [variant]: true, [align]: true, Active: $route.name === to.name })" @click="navigate">
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
};
</script>

<style lang="scss" src="./MenuButton.scss">
</style>
