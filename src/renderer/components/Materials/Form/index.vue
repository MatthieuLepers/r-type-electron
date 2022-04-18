<template>
  <form class="Form" @submit="$emit('submit', $event)">
    <slot />
  </form>
</template>

<script>
export default {
  name: 'Form',
};
</script>

<style lang="scss" src="./index.scss">
</style>
