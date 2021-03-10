<template>
  <div class="FormToggleButton">
    <input type="checkbox" v-model="value" :name="name" :id="`FormToggleButton${_uid}`" />
    <label :for="`FormToggleButton${_uid}`"></label>
  </div>
</template>

<script>
export default {
  name: 'FormToggleButton',
  props: {
    value: { type: Boolean, required: true },
    name: { type: String, required: true },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
