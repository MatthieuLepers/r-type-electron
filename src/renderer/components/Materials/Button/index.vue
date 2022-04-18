<template>
  <button :class="GenerateModifiers('Button', { [variant]: !!variant, Disabled: disabled, Iconed: !!icon, [`Iconed-${iconSide}`]: true })" :type="type" :disabled="disabled" @click="$emit('click', $event)">
    <i v-if="icon" class="ButtonIcon" :class="icon"></i>
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false },
    variant: { type: String, default: null },
    icon: { type: String, default: null },
    iconSide: { type: String, default: 'Left' },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
