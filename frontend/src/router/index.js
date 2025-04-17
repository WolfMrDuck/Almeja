import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/components/LoginView.vue';
import Acceso from '@/components/Acceso.vue';

const routes = [
  {path: '/', component: LoginView},
  {path: '/acceso', component: Acceso},
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
export default router