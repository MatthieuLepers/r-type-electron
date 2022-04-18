export default {
  App: {
    TitleBarMenu: {
      fileMenu: {
        label: 'Fichier',
        exit: 'Quitter',
      },
      langMenu: {
        label: 'Langage',
        french: 'Français',
        english: 'Anglais',
      },
    },
  },
  Electron: {
    Dialog: {
      openFile: {
        title: 'Ouvrir...',
        buttonLabel: 'Ouvrir',
      },
      saveFile: {
        title: 'Enregistrer sous...',
        buttonLabel: 'Enregistrer',
      },
      filters: {
        '*': 'Tous les fichiers',
        txt: 'Fichier texte',
        json: 'Fichier JSON',
      },
    },
  },
  Date: {
    days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    daySuffix: [],
    defaultSuffix: '',
  },
  Materials: {
    Form: {
      DropArea: {
        areaLabel: 'Glisser-déposer des fichiers pour les téléverser',
      },
    },
  },
  Views: {
    Menu: {
      play: 'Jouer',
      settings: 'Paramètres',
      mods: 'Mods',
      tools: 'Outils',
    },
  },
};
