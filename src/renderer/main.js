import Vue from 'vue';
import App from './App';
import i18n from './plugins/i18n';
import router from './plugins/router';
import GenerateModifiers from './plugins/GenerateModifiers';
import DateFormat from './plugins/DateFormat';
import Global from './assets/js/stores/AppStore';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
Vue.use(GenerateModifiers);
Vue.use(DateFormat);

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
