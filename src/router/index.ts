import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/LandingPage.vue')
  },
  {
    path: '/client',
    redirect: '/client/dashboard'
  },
  {
    path: '/client/dashboard',
    name: 'ClientDashboard',
    component: () => import('@/views/ClientDashboard.vue')
  },
  {
    path: '/provider',
    name: 'ProviderDashboard',
    component: () => import('@/views/ProviderDashboard.vue')
  },
  {
    path: '/provider/leads',
    redirect: '/provider?tab=leads'
  },
  {
    path: '/provider/boosts',
    redirect: '/provider?tab=boosts'
  },
  {
    path: '/provider/wallet',
    redirect: '/provider?tab=wallet'
  },
  {
    path: '/provider/profile',
    redirect: '/provider?tab=profile'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
