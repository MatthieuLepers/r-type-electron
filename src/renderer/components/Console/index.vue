<template>
  <aside class="Console">
    <ul class="ConsoleHistory">
      <li v-for="(entry, i) in history" :key="i">
        {{ entry }}
      </li>
    </ul>
    <input
      class="ConsoleInput"
      type="text"
      spellcheck="false"
      v-model="command"
      @keydown="handleKeyPress"
    />
    <span aria-hidden="true" class="ConsoleCommandSuggestion">
      {{ currentSuggestion }}
    </span>
  </aside>
</template>

<script>
import Vue from 'vue';
import CommandParser from '@/assets/js/utils/CommandParser';

export default {
  name: 'Console',
  data() {
    return {
      command: '',
      history: [],
      suggestions: {
        current: 0,
        available: [],
      },
    };
  },
  computed: {
    currentSuggestion() {
      return this.suggestions.available[this.suggestions.current] || '';
    },
  },
  watch: {
    command(command) {
      const parser = new CommandParser(command);
      this.suggestions.available = parser.getSuggestions();
      this.suggestions.current = 0;
    },
  },
  methods: {
    handleKeyPress(e) {
      switch (e.key) {
        case 'ArrowUp':
          this.handlePressArrowUp(e);
          break;
        case 'ArrowDown':
          this.handlePressArrowDown(e);
          break;
        case 'Tab':
          this.handlePressTab(e);
          break;
        case 'Enter':
          this.handleExecute(e);
          break;
        default:
      }
    },
    handlePressArrowDown(e) {
      e.preventDefault();
      if (this.suggestions.current + 1 < this.suggestions.available.length) {
        this.suggestions.current += 1;
      }
    },
    handlePressArrowUp(e) {
      e.preventDefault();
      if (this.suggestions.current - 1 >= 0) {
        this.suggestions.current -= 1;
      }
    },
    handlePressTab(e) {
      e.preventDefault();
      if (this.suggestions.available.length) {
        this.command = this.currentSuggestion;

        const nextCommandSuggestion = new CommandParser(`${this.currentSuggestion}.`).getCommandSuggestions();
        const nextArgSuggestion = new CommandParser(`${this.currentSuggestion} `).getArgumentSuggestions();

        if (nextCommandSuggestion.length) {
          this.command += '.';
        } else if (nextArgSuggestion.length) {
          this.command += ' ';
        }
      }
    },
    handleExecute(e) {
      e.preventDefault();
      const parser = new CommandParser(this.command);
      parser.executeCommand(this.history);
      this.command = '';
      Vue.nextTick(() => {
        const historyNode = this.$el.querySelector('.ConsoleHistory');
        historyNode.scrollTop = historyNode.scrollHeight;
      });
    },
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
