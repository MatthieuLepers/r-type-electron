import { createWebHashHistory, createRouter } from 'vue-router';

import MainView from '@renderer/views/Main/index.vue';

const routes = [
  { path: '/', name: 'Home', component: MainView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
