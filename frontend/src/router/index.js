import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import Panel from '@/views/Panel.vue'


const routes = [
  { 
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/panel',
    name: 'panel',
    component: Panel,
    meta: {requiresAuth: true} // Meta para rutas protegidas
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegación global
router.beforeEach((to, from, next) => {
  // Comprobar si la ruta requiere autenticación
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verificar si el usuario está autenticado 
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      next({ name: 'login' })
    } else {
      next() // Continuar con la navegación
    }
  } else {
    next() // Continuar con la navegación para rutas públicas
  }
})

export default router
