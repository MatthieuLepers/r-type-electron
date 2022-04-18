<template>
  <button :class="GenerateModifiers('DataTableButton', { [`${variant}`]: true, ...modifiers })" @click="$emit('click', $event)">
    <i class="DataTableButtonIcon" :class="icon" v-if="icon"></i>
    <div class="DataTableButtonContent">
      <slot>
        <span v-if="modifiers.More"></span>
        <span v-else>{{ label }}</span>
      </slot>
    </div>
  </button>
</template>

<script>
export default {
  name: 'DataTableButton',
  props: {
    variant: { type: String, default: 'Round' },
    modifiers: { type: Object, default: () => ({}) },
    icon: { type: String, default: null },
    label: { type: String, default: null },
  },
};
</script>

<style lang="scss" src="./Button.scss">
</style>
