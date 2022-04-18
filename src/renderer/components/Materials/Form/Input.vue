<template>
  <div :class="GenerateModifiers('FormInput', { Valid: state !== null && state, Invalid: state !== null && !state, [variant]: !!variant, Focus: focused, Required: required, Readonly: readonly, Disabled: disabled, Adornment: iconData.icon || iconData.text || type === 'password' })">
    <p :class="GenerateModifiers('FormInputMessage', { [messageData.type]: true })" v-if="messageData && ((state === false && messageData.type === MessageTypeEnum.ERROR) || messageData.type === MessageTypeEnum.HELP)">
      {{ messageData.content }}
    </p>
    <input
      :id="id || `formInput${_uid}`"
      :type="computedType"
      :placeholder="placeholder"
      :pattern="pattern"
      :required="required"
      :readonly="readonly"
      :disabled="disabled"
      :value="value"
      :min="type === 'number' ? min : null"
      :max="type === 'number' && max ? max : null"
      :step="type === 'number' ? Math.abs(step) : null"
      @input="$emit('input', cast($event.target.value, typeof value))"
      @click="$emit('click')"
      @keydown="$emit('keydown', $event)"
      @focus="handleFocus('focus', true)"
      @blur="handleFocus('blur', false)"
      @mousewheel="handleMouseWheel"
    />
    <label class="FormInputLabel" :for="`formInput${_uid}`" v-if="label">
      {{ label }}
    </label>
    <component
      :is="iconData.clickable ? 'button' : 'span'"
      v-if="(iconData.icon && type !== 'password') || type === 'password' || iconData.text"
      :class="[computedIcon, GenerateModifiers('FormInputAdornment', { Clickable: iconData.clickable || type === 'password' })]"
      :title="iconData.title"
      @click.stop="handleIconClick"
    >
      {{ iconData.text || '' }}
    </component>
  </div>
</template>

<script>
import MessageTypeEnum from '@/assets/js/classes/enums/MessageTypeEnum';

export default {
  name: 'FormInput',
  props: {
    value: { type: [String, Number] },
    id: { type: String, default: null },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: null },
    pattern: { type: String, default: null },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: null },
    iconData: { type: Object, default: () => ({}) },
    variant: { type: String, default: null },
    state: { type: Boolean, default: null },
    messageData: { type: Object, default: null },
    min: { type: Number, default: 0 },
    max: { type: Number },
    step: { type: Number, default: 1 },
  },
  data() {
    return {
      MessageTypeEnum,
      focused: false,
      passwordIcon: 'icon-eye',
    };
  },
  computed: {
    computedType() {
      if (this.type === 'password') {
        return this.passwordIcon === 'icon-eye' ? 'password' : 'text';
      }
      return this.type;
    },
    computedIcon() {
      if (this.iconData.icon && this.type !== 'password') {
        return this.iconData.icon;
      } if (this.type === 'password') {
        return this.passwordIcon;
      } if (this.iconData.text) {
        return this.iconData.text;
      }
      return null;
    },
  },
  methods: {
    handleFocus(type, value) {
      this.focused = value;
      this.$emit(type, this.focused);
    },
    handleIconClick() {
      if (this.type === 'password') {
        this.passwordIcon = `icon-eye${this.passwordIcon === 'icon-eye' ? '-slash' : ''}`;
      }
      this.$emit('icon-click');
    },
    handleMouseWheel(e) {
      if (this.type === 'number' && this.focused) {
        e.preventDefault();
        const offset = e.deltaY < 0 ? 1 : -1;
        this.$emit('input', this.cast(Math.min(this.max || null, Math.max(this.min, this.value + offset)), typeof this.value));
      }
    },
    cast(value, type) {
      if (type === 'number') {
        return parseInt(value, 10) || this.min || 0;
      }
      return value;
    },
  },
};
</script>

<style lang="scss" src="./Input.scss">
</style>
