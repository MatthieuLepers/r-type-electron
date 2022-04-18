/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
class WindowStore {
  /**
   * @constructor
   */
  constructor() {
    this.objList = {};
  }

  /**
   * @return {Number}
   */
  get length() {
    return this.objList.length;
  }

  /**
   * @param {Window} obj
   */
  add(obj) {
    if (!this.objList[obj.name]) {
      this.objList[obj.name] = obj;
    }
  }

  /**
   * @param {Window} obj
   */
  close(obj) {
    if (this.objList[obj.name]) {
      delete this.objList[obj.name];
    }
  }

  /**
   * @param {String} name
   * @return {Window|null}
   */
  get(name) {
    return this.objList[name] || null;
  }

  /**
   * @param {String} windowName
   * @param {String} channel
   * @param  {...any} data
   */
  sendData(windowName, channel, ...data) {
    if (this.objList[windowName]) {
      this.objList[windowName].sendData(channel, ...data);
    }
  }

  /**
   * @param {String} channel
   * @param  {...any} data
   */
  broadcastData(channel, ...data) {
    Object.values(this.objList).forEach((window) => {
      window.sendData(channel, ...data);
    });
  }
}

export default new WindowStore();
