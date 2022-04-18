import { ipcRenderer, remote } from 'electron';
import os from 'os';
import i18n from '@/plugins/i18n';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class SaveFileDialog {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options) {
    this.options = {
      title: i18n.t('Electron.Dialog.saveFile.title'),
      defaultPath: `${os.homedir()}/Desktop`,
      buttonLabel: i18n.t('Electron.Dialog.saveFile.buttonLabel'),
      filters: [
        { name: i18n.t('Electron.Dialog.filters.*'), extensions: ['*'] },
      ],
      properties: [],
    };

    Object.assign(this.options, options);
  }

  /**
   * @return {String}
   */
  showDialog() {
    return remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), this.options);
  }

  /**
   * @param {String} data
   */
  saveFile(data) {
    const filePath = this.showDialog();

    if (filePath) {
      ipcRenderer.sendSync('write-file-sync', filePath, data);
    }
  }
}
