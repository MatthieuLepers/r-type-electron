<template>
  <div :class="GenerateModifiers('FormSelectMultiple', { Focus: focused, Open: open })" @keydown="handleContainerKeydown">
    <label class="FormSelectMultipleLabel" :for="`formSelectMultiple${_uid}`" v-if="label">
      {{ label }} <strong v-if="selectedOptions.length > 0">({{ selectedOptions.length }})</strong>
    </label>
    <select v-if="isGroupable" :name="name" :id="`formSelectMultiple${_uid}`" multiple>
      <optgroup :label="group" v-for="group in Object.keys(groupedOptions)" :key="group">
        <option :value="option.value" :selected="selectedOptions.includes(option.value)" v-for="(option, i) in groupedOptions[key]" :key="i">
          {{ option.label }}
        </option>
      </optgroup>
    </select>
    <select v-else :name="name" :id="`formSelectMultiple${_uid}`" multiple>
      <option :value="option.value" :selected="selectedOptions.includes(option.value)" v-for="(option, i) in filteredOptions" :key="i">
        {{ option.label }}
      </option>
    </select>
    <div class="FormSelectMultipleContainer">
      <div class="FormSelectMultipleOuter">
        <FormInput
          type="text"
          :placeholder="inputPlaceholder"
          v-model="search"
          @keydown.enter.prevent.stop="handleInputEnter"
          @focus="focused => handleFocus(focused, true)"
          @blur="focused => handleFocus(focused, true)"
        />
        <span class="FormSelectMultipleOuterArrow" @click="open = !open"></span>
      </div>
      <div v-if="isGroupable" :class="GenerateModifiers('FormSelectMultipleDropdown', { [dropdownPosition]: true, Overflowing: isOverflowing })" ref="dropdown">
        <div class="FormSelectMultipleDropdownGroup" v-for="group in Object.keys(groupedOptions)" :key="group">
          <div class="FormSelectMultipleDropdownGroupLabel">
            <slot name="optgroup" :group="group">{{ group }}</slot>
          </div>
          <button
            :class="GenerateModifiers('FormSelectMultipleDropdownItem', { Selected: selectedOptions.includes(option.value) })"
            type="button"
            v-for="(option, i) in groupedOptions[group]"
            :key="i"
            @click="handleSelectOption(option.value)"
          >
            <slot name="option" :option="option" :selected="selectedOptions.includes(option.value)">
              <span class="FormSelectMultipleDropdownItemIcon"></span>
              {{ option.label }}
            </slot>
          </button>
        </div>
      </div>
      <div v-else :class="GenerateModifiers('FormSelectMultipleDropdown', { [dropdownPosition]: true, Overflowing: isOverflowing })" ref="dropdown">
        <div
          :class="GenerateModifiers('FormSelectMultipleDropdownItem', { Selected: selectedOptions.includes(option.value), Focused: i === fakeIndex })"
          v-for="(option, i) in filteredOptions"
          :key="i"
          @click="handleSelectOption(option.value)"
        >
          <slot name="option" :option="option" :selected="selectedOptions.includes(option.value)">
            <span class="FormSelectMultipleDropdownItemIcon"></span>
            {{ option.label }}
          </slot>
        </div>
        <div :class="GenerateModifiers('FormSelectMultipleDropdownItem', { Empty: true })" v-if="!filteredOptions.length" >
          <slot name="empty" :search="search" :reset="reset" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import FormInput from './Input';

export default {
  name: 'FormSelectMultiple',
  components: { FormInput },
  props: {
    value: { type: Array, required: true },
    name: { type: String, default: null },
    label: { type: String, default: null },
    options: { type: Array, default: () => [] },
    inputPlaceholder: { type: String, default: null },
    dropdownPosition: { type: String, default: 'Bottom' },
  },
  data() {
    return {
      selectedOptions: this.value,
      focused: false,
      open: false,
      search: '',
      isOverflowing: false,
      fakeIndex: 0,
    };
  },
  computed: {
    filteredOptions() {
      return this.options.filter((option) => option.label.toLowerCase().indexOf(this.search.toLowerCase()) >= 0);
    },
    groupedOptions() {
      return this.options.reduce((acc, option) => ({ ...acc, [option.group]: (acc[option.group] || []).concat([option]) }), {});
    },
    isGroupable() {
      return !!this.options.length && this.options.every((option) => !!option.group);
    },
  },
  methods: {
    handleContainerKeydown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        this.fakeIndex = Math.min(this.filteredOptions.length - 1, this.fakeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        this.fakeIndex = Math.max(0, this.fakeIndex - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        this.handleSelectOption(this.filteredOptions[this.fakeIndex].value);
      }
    },
    handleInputEnter() {
      this.$emit('keydown-enter', this.search, this.reset.bind(this));
    },
    handleSelectOption(optionValue) {
      if (this.selectedOptions.includes(optionValue)) {
        this.selectedOptions.splice(this.selectedOptions.indexOf(optionValue), 1);
      } else {
        this.selectedOptions.push(optionValue);
      }
      this.$emit('input', this.selectedOptions);
    },
    handleFocus(focused, open) {
      this.focused = focused;
      this.open = open;
      Vue.nextTick(() => {
        this.isOverflowing = this.$refs.dropdown.offsetHeight - this.$refs.dropdown.scrollHeight < 0;
      });
    },
    reset() {
      this.search = '';
    },
  },
  watch: {
    value(value) {
      this.selectedOptions = value;
    },
    open(open) {
      if (open) {
        window.onclick = (e) => {
          // eslint-disable-next-line
          console.log(this._uid);
          if (!e.target.matches('.FormSelectMultipleContainer') && !e.target.closest('.FormSelectMultipleContainer')) {
            const target = e.target.closest('.FormSelectMultipleContainer') || e.target;
            if (target !== this.$el) {
              this.handleFocus(false, false);
              window.onclick = null;
            }
          }
        };
      } else {
        window.onclick = null;
      }
    },
  },
};
</script>

<style lang="scss" src="./SelectMultiple.scss">
</style>
