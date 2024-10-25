import get from 'lodash.get';

import CommandsData from '@renderer/core/datas/Commands';
import type { AnyConstructor } from '@renderer/core/@types/Mixin';
import type AbstractCommand from '@renderer/core/datas/Commands/AbstractCommand';

export type TCommands = Record<string, Record<string, ICommandData>>;

export interface ICommandData {
  usage: string;
  argumentSuggestions: Record<string, () => Array<string>>;
  clazz: AnyConstructor<AbstractCommand>;
}

export default class CommandParser {
  public original: string;

  constructor(command: string) {
    this.original = command;
  }

  get command(): string {
    const [cmd] = this.original.split(' ');
    return cmd;
  }

  get arguments(): Array<string> {
    const [, ...args] = this.original.split(' ');
    return args;
  }

  getCommandSuggestions(): Array<string> {
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

  getArgumentSuggestions(): Array<string> {
    if (!this.arguments.length && !this.original.endsWith(' ')) {
      return [];
    }

    const splittedArgs = [...this.arguments];
    const searchSuggestion = splittedArgs.pop() ?? '';
    const argName = `arg${splittedArgs.length}`;
    const current: ICommandData = get(CommandsData, this.command);
    const suggestionKeys = current?.argumentSuggestions?.[argName] ? current.argumentSuggestions[argName]() : [];

    return suggestionKeys
      .filter((sug) => sug.startsWith(searchSuggestion))
      .map((sug) => `${this.command} ${splittedArgs.join(' ')}${splittedArgs.length ? ' ' : ''}${sug}`)
    ;
  }

  getSuggestions(): Array<string> {
    const commandSuggestion = this.getCommandSuggestions();
    const argSuggestion = this.getArgumentSuggestions();

    return (commandSuggestion.length && commandSuggestion) || (argSuggestion.length && argSuggestion) || [];
  }

  get commandClass(): AnyConstructor<AbstractCommand> {
    return get(CommandsData, this.command.trim()).clazz;
  }

  executeCommand(history: Array<string>) {
    if (this.commandClass) {
      const inst = new this.commandClass(this.command, ...this.arguments);
      history.push(inst.execute());
    } else {
      history.push(`Command '${this.command}' is not recognized`);
    }
  }
}
