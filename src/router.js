import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@vueuse/firebase';

const routes = [
  {
    path: '/',
    component: () => import('./views/Dashboard.vue'),
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
  const { isAuthenticated } = useAuth();
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login');
  } else {
    next();
  }
});

export default router;
