import DateUtils from '../assets/js/utils/DateUtils';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default {
  install(Vue) {
    Vue.prototype.DateFormat = DateUtils.format;
  },
};
