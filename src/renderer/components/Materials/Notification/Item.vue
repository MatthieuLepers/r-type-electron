<template>
  <div :class="`${GenerateModifiers('NotificationItem', { Disapear: disapear })} ${variant}`">
    <slot />
  </div>
</template>

<script>
import NotificationStore from './Store';

export default {
  name: 'NotificationItem',
  props: {
    notification: { type: Object, required: true },
  },
  data() {
    return {
      disapear: false,
    };
  },
  mounted() {
    this.$parent.$emit('notificationStart', this.notification);
    window.setTimeout(() => {
      this.disapear = true;
      this.$parent.$emit('notificationFade', this.notification);
      window.setTimeout(() => {
        NotificationStore.removeNotification(this.index);
        this.$parent.$emit('notificationEnd', this.notification);
      }, 500);
    }, 3000);
  },
};
</script>

<style lang="scss" src="./Item.scss">
</style>
