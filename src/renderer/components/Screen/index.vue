<template>
  <div class="Screen">
    <h1 v-if="title" class="ScreenContentTitle">{{ title }}</h1>
    <div class="ScreenContent">
      <slot name="content" />
    </div>
    <div class="ScreenFooter">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Screen',
  props: {
    title: { type: String, default: null },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
