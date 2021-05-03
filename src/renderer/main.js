import Vue from 'vue';
import router from './plugins/router';
import i18n from './plugins/i18n';
import App from './App';
import Global from './js/stores/AppStore';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

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
