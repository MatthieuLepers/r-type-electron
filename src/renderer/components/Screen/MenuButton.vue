<template>
  <router-link
    v-slot="{ navigate }"
    :to="to"
    custom
  >
    <button
      v-bind="$attrs"
      :class="GenerateModifiers('screen-menu-button', {
        ...modifiers,
        active: $route.name === props.to.name,
      })"
      @click="navigate"
    >
      <slot />
    </button>
  </router-link>
</template>

<script setup>
defineOptions({ name: 'ScreenMenuButton' });

const props = defineProps({
  to: { type: [String, Object], required: true },
  /**
   * Valid modifiers:
   * width: xs, s, m, l, xl, xxl, xs-gap, s-gap, m-gap, l-gap, xl-gap, xxl-gap, tiny
   * position: end
   */
  modifiers: { type: Object, default: () => ({ xxl: true }) },
});
</script>

<style lang="scss" src="./MenuButton.scss">
</style>
