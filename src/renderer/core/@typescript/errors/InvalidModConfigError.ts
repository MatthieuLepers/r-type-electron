export default class InvalidModConfigError extends Error {
  constructor(clazz: Function) {
    super(`[Mod] Cannot find a valid configuration file for mod "${clazz.name}"`);
  }
}
