import Vue from 'vue';
import VueI18n from 'vue-i18n';
import i18n from '../i18n/index';

Vue.use(VueI18n);
export default new VueI18n({
  locale: 'en-EN', // set locale
  messages: i18n, // set locale messages
});
