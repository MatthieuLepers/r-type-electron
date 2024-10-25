export default {
  App: {
    TitleBarMenu: {
      fileMenu: {
        label: 'Fichier',
        exit: 'Quitter',
      },
      langMenu: {
        label: 'Langage',
        'fr-FR': 'Français',
        'en-EN': 'Anglais',
      },
    },
  },
  Updater: {
    downloadingUpdate: 'Téléchargement de la mise à jour...',
    readyToInstall: 'Mise à jour prête à être installée !',
    quitAndInstall: 'Mettre à jour',
  },
  Electron: {
    dialogs: {
      filters: {
        '*': 'Tous les fichiers',
        json: 'Fichier JSON',
        txt: 'Fichier texte',
      },
      openFile: {
        title: 'Ouvrir...',
        button: 'Ouvrir',
      },
      saveFile: {
        title: 'Enregistrer sous...',
        button: 'Enregistrer',
      },
    },
  },
  Date: {
    days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    daySuffix: ['er'],
    defaultDaySuffix: '',
  },
  Materials: {
    Tabs: {
      newTab: 'Nouvel onglet',
    },
    Form: {
      Select: {
        removeOption: 'Retirer l\'option {0}',
        emptyResult: 'Aucun résultat pour « {0} »',
      },
      ObjectList: {
        addModel: 'Ajouter un model',
        removeModel: 'Retirer ce model',
      },
    },
  },
  Views: {
    Menu: {
      play: 'Play',
      settings: 'Paramètres',
      tools: 'Outils',
    },
  },
};
