import { createRouter, createWebHistory } from 'vue-router';
import { auth } from './services/auth';

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/card/:id',
    component: () => import('./views/CardDetail.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    next('/login');
  } else {
    next();
  }
});

export default router;
