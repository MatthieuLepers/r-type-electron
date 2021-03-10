import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import routerOptions from './router';

import App from './App';
import I18N from './i18n/index';
import Global from './js/stores/AppStore';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'fr-FR', // set locale
  messages: I18N, // set locale messages
});

Vue.use(VueRouter);
const router = new VueRouter(routerOptions);
router.beforeEach((to, from, next) => {
  if (to.name !== 'Menu' && !Global.loaded) {
    next({ name: 'Menu' });
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  i18n,
  router,
}).$mount('#app');
