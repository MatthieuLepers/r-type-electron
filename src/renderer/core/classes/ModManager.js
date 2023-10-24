import Class from '@renderer/core/classes/Class';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';

/**
 * @param {String} prefab
 * @param {Function} fn
 * @param {String} modName
 */
const AddPrefabPostInit = (prefab, fn, modName) => {
  if (!this.$bundleList[modName]) {
    this.$bundleList[modName] = {};
  }
  if (!this.$bundleList[modName].prefabs) {
    this.$bundleList[modName].prefabs = {};
  }
  if (!this.$bundleList[modName].prefabs[prefab]) {
    this.$bundleList[modName].prefabs[prefab] = [];
  }
  this.$bundleList[modName].prefabs[prefab].push(fn);
};

/**
 * @param {String} component
 * @param {Function} fn
 * @param {String} modName
 */
const AddComponentPostInit = (component, fn, modName) => {
  if (!this.$bundleList[modName]) {
    this.$bundleList[modName] = {};
  }
  if (!this.$bundleList[modName].components) {
    this.$bundleList[modName].components = {};
  }
  if (!this.$bundleList[modName].components[component]) {
    this.$bundleList[modName].components[component] = [];
  }
  this.$bundleList[modName].components[component].push(fn);
};

/**
 * @param {String} dir
 * @return {Boolean}
 */
// function $isValidModDir(dir) {
//   const dirContent = api.sendSync('readDirSync', { path: `mods/${dir}` });
//   return dirContent.includes(`${dir}.js`) && dirContent.includes('Config.js');
// }

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class ModManager extends Class {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.modList = {};
    this.$bundleList = {};

    this.addComponent(EventEmitter, ModManager);
  }

  /**
   * @return {this}
   */
  async loadMods() {
    // const promises = Promise.all(api
    //   .sendSync('readDirSync', { path: 'mods', onlyDirectories: true })
    //   .filter($isValidModDir)
    //   .map((modFolder) => require(`../../../../../mods/${modFolder}/${modFolder}.js`)));
    // this.modList = (await promises).reduce((acc, module) => ({ ...acc, [module.default.name]: new module.default(this.createEnvironment(module.default.name)) }), {});
    return this;
  }

  /**
   * @param {String} modName
   * @return {Boolean}
   */
  isModEnabled(modName) {
    return this.isModRegistered(modName) && this.modList[modName].$enabled;
  }

  /**
   * @param {String} modName
   * @return {Boolean}
   */
  isModRegistered(modName) {
    return !!this.modList[modName];
  }

  /**
   * @param {String} modName
   * @return {Boolean}
   */
  isModCrashed(modName) {
    return this.isModRegistered(modName) && this.modList[modName].$crashed;
  }

  /**
   * @param {String} modName
   * @return {Mod|null}
   */
  getMod(modName = '_') {
    if (this.isModRegistered(modName)) {
      return this.modList[modName];
    }
    return null;
  }

  /**
   * @param {String} modName
   */
  enableMod(modName) {
    if (this.isModRegistered(modName) && !this.isModEnabled(modName)) {
      this.modList[modName].enable();
      this.on('enableMod', { modName });
    }
  }

  /**
   * @param {String} modName
   */
  disableMod(modName) {
    if (this.isModRegistered(modName) && this.isModEnabled(modName)) {
      this.modList[modName].disable();
      this.on('disableMod', { modName });
    }
  }

  /**
   * @param {String} modName
   * @return {Object}
   */
  createEnvironment(modName) {
    return {
      AddPrefabPostInit: (prefab, fn) => AddPrefabPostInit.call(this, prefab, fn, modName),
      AddComponentPostInit: (component, fn) => AddComponentPostInit.call(this, component, fn, modName),
    };
  }

  /**
   * @param {String} bundleName
   * @param {EntityScript} inst
   * @return {EntityScript}
   */
  applyPrefabBundle(bundleName, inst) {
    Object.keys(this.$bundleList)
      .filter(this.isModEnabled.bind(this))
      .map((modName) => this.$bundleList[modName])
      .forEach((modData) => {
        if (modData.prefabs && modData.prefabs[bundleName]) {
          modData.prefabs[bundleName].forEach((fn) => { fn(inst); });
        }
      })
    ;
    return inst;
  }

  /**
   * @param {String} bundleName
   * @param {Component} component
   * @return {Component}
   */
  applyComponentBundle(bundleName, component) {
    Object.keys(this.$bundleList)
      .filter(this.isModEnabled.bind(this))
      .map((modName) => this.$bundleList[modName])
      .forEach((modData) => {
        if (modData.components && modData?.components[bundleName]) {
          modData.components[bundleName].forEach((fn) => { fn(component); });
        }
      })
    ;
    return component;
  }
}
