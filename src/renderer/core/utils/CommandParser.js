import CommandsData from '@renderer/core/datas/Commands';

function $followDotPath(path, obj) {
  const splittedPath = path.split('.');
  let current = obj;
  splittedPath.forEach((part) => {
    if (current[part]) {
      current = current[part];
    }
  });

  return current;
}

export default class CommandParser {
  /**
   * @constructor
   * @param {String} command
   */
  constructor(command) {
    this.original = command;
  }

  /**
   * @return {String}
   */
  get command() {
    const [cmd] = this.original.split(' ');
    return cmd;
  }

  /**
   * @return {String[]}
   */
  get arguments() {
    const [, ...args] = this.original.split(' ');
    return args;
  }

  /**
   * @return {Object}
   */
  getCommandSuggestions() {
    const splittedCmd = this.command.split('.');
    let searchSuggestion = splittedCmd.pop();
    let current = CommandsData;
    let suggestionKeys = Object.keys(current);

    if (splittedCmd.length) {
      splittedCmd.forEach((part) => {
        if (suggestionKeys.length && current[part]) {
          if (!current[part].clazz) {
            current = current[part];
            suggestionKeys = Object.keys(current);
          } else {
            current = current[part];
            suggestionKeys = [];
          }
        }
      });
    }

    if (current[searchSuggestion]) {
      if (!current[searchSuggestion].clazz) { // more command suggestion
        current = current[searchSuggestion];
        suggestionKeys = Object.keys(current);
        splittedCmd.push(searchSuggestion);
        searchSuggestion = '';
      } else { // arguments suggestion
        suggestionKeys = [];
        searchSuggestion = null;
      }
    }

    return suggestionKeys
      .filter((sug) => sug.startsWith(searchSuggestion))
      .map((sug) => `${splittedCmd.join('.')}${splittedCmd.length ? '.' : ''}${sug}`)
    ;
  }

  /**
   * @return {Object}
   */
  getArgumentSuggestions() {
    if (!this.arguments.length && !this.original.endsWith(' ')) {
      return {
        parts: [],
        search: '',
        suggestions: [],
      };
    }

    const splittedArgs = [...this.arguments];
    const searchSuggestion = splittedArgs.pop() ?? '';
    const argName = `arg${splittedArgs.length}`;
    const current = $followDotPath(this.command, CommandsData);
    const suggestionKeys = current?.argumentSuggestions?.[argName] ? current.argumentSuggestions[argName]() : [];

    return suggestionKeys
      .filter((sug) => sug.startsWith(searchSuggestion))
      .map((sug) => `${this.command} ${splittedArgs.join(' ')}${splittedArgs.length ? ' ' : ''}${sug}`)
    ;
  }

  /**
   * @return {String[]}
   */
  getSuggestions() {
    const commandSuggestion = this.getCommandSuggestions();
    const argSuggestion = this.getArgumentSuggestions();

    return (commandSuggestion.length && commandSuggestion) || (argSuggestion.length && argSuggestion) || [];
  }

  /**
   * @return {Class<AbstractCommand>}
   */
  get commandClass() {
    const splittedCmd = this.command.split('.');
    let current = CommandsData;
    splittedCmd.forEach((part) => {
      if (current[part]) {
        current = current[part];
      }
    });

    return current.clazz ?? null;
  }

  /**
   * @param {String[]} history
   */
  executeCommand(history) {
    if (this.commandClass) {
      const inst = new this.commandClass(this.command, ...this.arguments);
      history.push(inst.execute());
    } else {
      history.push(`Command '${this.command}' is not recognized`);
    }
  }
}
