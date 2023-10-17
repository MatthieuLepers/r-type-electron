import { settingsStore } from '@renderer/core/entities/setting/store';

export default {
  'Alt+F4': () => {
    api.send('close:main');
  },
  'Command+Q': () => {
    api.send('close:main');
  },
};
