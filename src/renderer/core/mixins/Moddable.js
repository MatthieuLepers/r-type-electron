import Global from '@renderer/core/stores/AppStore';

const Moddable = (clazz) => {
  const classes = {
    [clazz.name]: class extends clazz {
      constructor(...args) {
        super(...args);
        this.applyModsBundle(Global.ModKnowledge);
      }
    },
  };
  return classes[clazz.name];
};

export default Moddable;
