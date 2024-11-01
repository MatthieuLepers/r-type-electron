import { createApp } from 'vue';

import App from '@renderer/App.vue';
import router from '@renderer/plugins/router';
import i18n from '@renderer/plugins/i18n';
import GenerateModifiers from '@renderer/plugins/GenerateModifiers';
import DateFormat from '@renderer/plugins/DateFormat';
import Global from '@/renderer/core/stores/AppStore';

router.beforeEach((to, _from, next) => {
  if (to.name !== 'DevTools' && to.name !== 'Menu' && !Global.loaded) {
    next({ name: 'Menu' });
  } else {
    next();
  }
});

const app = createApp(App);

app.directive('icon', {
  created(el, binding) {
    el.classList.add(`icon-${binding.arg}`);
  },
});

app.use(router);
app.use(i18n);
app.use(GenerateModifiers);
app.use(DateFormat);
app.mount('#app');
