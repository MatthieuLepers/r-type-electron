export default {
  App: {
    TitleBarMenu: {
      fileMenu: {
        label: 'File',
        exit: 'Exit',
      },
      langMenu: {
        label: 'Language',
        french: 'French',
        english: 'English',
      },
    },
  },
  Electron: {
    Dialog: {
      openFile: {
        title: 'Open...',
        buttonLabel: 'Open',
      },
      saveFile: {
        title: 'Save as...',
        buttonLabel: 'Save',
      },
      filters: {
        '*': 'All files',
        txt: 'Text file',
        json: 'JSON file',
      },
    },
  },
  Date: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    daySuffix: ['st', 'nd', 'rd'],
    defaultSuffix: 'th',
  },
  Materials: {
    Form: {
      DropArea: {
        areaLabel: 'Drag\'n\'drop files to upload them',
      },
    },
  },
  Views: {
    Menu: {
      play: 'Play',
      settings: 'Settings',
      mods: 'Mods',
      tools: 'Tools',
    },
  },
};
