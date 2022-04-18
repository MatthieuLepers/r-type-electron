import { BrowserWindow } from 'electron';
import WindowsStore from './Store';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Window {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(name, options = {}) {
    this.name = name;
    this.browserWindow = null;
    this.options = {
      width: 1920,
      height: 1080,
      useContentSize: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: false,
        enableRemoteModule: true,
      },
      resizable: true,
    };
    this.vue = {
      template: 'index.html',
      routePath: null,
    };

    Object.assign(this.options, options);
  }

  /**
   * @return {String}
   */
  get windowUrl() {
    return process.env.NODE_ENV === 'development'
      ? `http://localhost:9080${this.vue.routePath ? `/#/${this.vue.routePath}` : `/${this.vue.template}`}`
      : `file://${__dirname}/${this.vue.template}${this.vue.routePath ? `#${this.vue.routePath}` : ''}`
    ;
  }

  /**
   * @return {this}
   */
  create() {
    if (!WindowsStore.objList[this.name]) {
      this.browserWindow = new BrowserWindow(this.options);
      this.browserWindow.loadURL(this.windowUrl);
      this.browserWindow.on('closed', () => {
        WindowsStore.close(this);
        this.browserWindow = null;
      });
      WindowsStore.add(this);
    }

    return this;
  }

  /**
   * @param {String} routePath
   * @param {String} template
   * @return {this}
   */
  setRoute(routePath = null, template = 'index.html') {
    this.vue.routePath = routePath;
    this.vue.template = template;
    return this;
  }

  /**
   * @param {String} eventName
   * @param {...any} data
   */
  sendData(channel, ...data) {
    this.browserWindow.webContents.send(channel, ...data);
  }
}
