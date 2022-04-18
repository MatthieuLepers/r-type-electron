<template>
  <div :class="GenerateModifiers('ModalBackDrop', { Open: open })">
    <div :id="name" :class="`Modal size-${size}`">
      <div class="ModalTitle">
        <slot name="header">{{ title }}</slot>
      </div>
      <div class="ModalContent">
        <slot />
      </div>
      <div class="ModalActions">
        <slot name="footer" :accept="accept" :refuse="refuse" :close="hide">
          <button class="btn btn-refuse" v-if="cancelOnly || okCancel" @click="refuse">
            {{ cancelLabel }}
          </button>
          <button class="btn btn-accept" v-if="okOnly || okCancel" @click="accept">
            {{ okLabel }}
          </button>
        </slot>
      </div>
      <slot name="CloseButton" :close="hide">
        <button class="ModalCloseBtn" @click="hide"></button>
      </slot>
    </div>
  </div>
</template>

<script>
import ModalStore from './Store';

export default {
  name: 'Modal',
  props: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    okOnly: { type: Boolean, default: false },
    cancelOnly: { type: Boolean, default: false },
    okCancel: { type: Boolean, default: false },
    cancelLabel: { type: String, default: 'Cancel' },
    okLabel: { type: String, default: 'Ok' },
    size: { type: String, default: 'xs' },
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    show() {
      this.open = true;
      let downTarget = null;
      window.onmousedown = (e) => {
        if (e.target.matches('.ModalBackDrop')) {
          downTarget = e.target;
        }
      };
      window.onmouseup = (e) => {
        if (downTarget === e.target && e.target.matches('.ModalBackDrop')) {
          downTarget = null;
          this.open = false;
          window.onmousedown = null;
          window.onmouseup = null;
        }
      };
    },
    hide() {
      this.open = false;
      this.$emit('close');
    },
    refuse() {
      this.$emit('refuse');
      this.hide();
    },
    accept() {
      this.$emit('confirm');
      this.hide();
    },
  },
  mounted() {
    ModalStore.add(this);
  },
  destroyed() {
    ModalStore.remove(this);
  },
  watch: {
    open(value) {
      if (value) {
        this.$el.querySelector('input, select, textarea, area, button, a, [tabindex]').focus();
      }
    },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
