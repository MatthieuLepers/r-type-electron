export default {
  App: {
    TitleBarMenu: {
      fileMenu: {
        label: 'Files',
        exit: 'Exit',
      },
      langMenu: {
        label: 'Language',
        'fr-FR': 'French',
        'en-EN': 'English',
      },
    },
  },
  Updater: {
    downloadingUpdate: 'Downloading update...',
    readyToInstall: 'Update ready to install!',
    quitAndInstall: 'Install',
  },
  Electron: {
    dialogs: {
      filters: {
        '*': 'All files',
        json: 'JSON file',
        txt: 'Text file',
      },
      openFile: {
        title: 'Open...',
        button: 'Open',
      },
      saveFile: {
        title: 'Save as...',
        button: 'Save',
      },
    },
  },
  Date: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    daySuffix: ['st', 'nd', 'rd'],
    defaultDaySuffix: 'th',
  },
  Materials: {
    Tabs: {
      newTab: 'New tab',
    },
    Form: {
      Select: {
        removeOption: 'Remove option',
        emptyResult: 'No result for « {0} »',
      },
      ObjectList: {
        addModel: 'Add model',
        removeModel: 'Remove this model',
      },
    },
  },
};
