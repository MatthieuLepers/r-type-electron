<template>
  <div class="devtools-console">
    <ul class="devtools-console__history" ref="history">
      <li
        v-for="(entry, i) in state.history"
        :key="i"
      >
        {{ entry }}
      </li>
    </ul>
    <input
      v-model="state.command"
      class="devtools-console__input"
      type="text"
      spellcheck="false"
      @keydown="actions.handleKeyPress"
    />
    <span
      class="devtools-console__command-suggestion"
      aria-hidden="true"
    >
      {{ State.currentSuggestion }}
    </span>
  </div>
</template>

<script setup>
import {
  reactive,
  computed,
  watch,
  ref,
  nextTick,
} from 'vue';
import CommandParser from '@renderer/core/utils/CommandParser';

defineOptions({ name: 'DevToolsConsole' });

const history = ref(null);

const state = reactive({
  command: '',
  history: [],
  suggestions: {
    current: 0,
    available: [],
  },
});

const State = computed(() => ({
  currentSuggestion: state.suggestions.available[state.suggestions.current] ?? '',
}));

watch(() => state.command, (newVal) => {
  const parser = new CommandParser(newVal);
  state.suggestions.available = parser.getSuggestions();
  state.suggestions.current = 0;
});

const actions = {
  handleKeyPress(e) {
    switch (e.key) {
      case 'ArrowUp':
        actions.handlePressArrowUp(e);
        break;
      case 'ArrowDown':
        actions.handlePressArrowDown(e);
        break;
      case 'Tab':
        actions.handlePressTab(e);
        break;
      case 'Enter':
        actions.handleExecute(e);
        break;
      default:
    }
  },
  handlePressArrowDown(e) {
    e.preventDefault();
    if (state.suggestions.current + 1 < state.suggestions.available.length) {
      state.suggestions.current += 1;
    }
  },
  handlePressArrowUp(e) {
    e.preventDefault();
    if (state.suggestions.current - 1 >= 0) {
      state.suggestions.current -= 1;
    }
  },
  handlePressTab(e) {
    e.preventDefault();
    if (state.suggestions.available.length) {
      state.command = State.value.currentSuggestion;

      const nextCommandSuggestion = new CommandParser(`${State.value.currentSuggestion}.`).getCommandSuggestions();
      const nextArgSuggestion = new CommandParser(`${State.value.currentSuggestion} `).getArgumentSuggestions();

      if (nextCommandSuggestion.length) {
        state.command += '.';
      } else if (nextArgSuggestion.length) {
        state.command += ' ';
      }
    }
  },
  handleExecute(e) {
    e.preventDefault();
    const parser = new CommandParser(state.command);
    parser.executeCommand(state.history);
    state.command = '';
    nextTick(() => {
      history.value.scrollTop = history.value.scrollHeight;
    });
  },
};
</script>

<style lang="scss" src="./ConsoleTab.scss">
</style>
