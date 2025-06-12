import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import Panel from '@/views/Panel.vue'
import { useAutenticacion } from '@/composables/useAutenticacion'


const routes = [
  { 
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/panel',
    name: 'panel',
    component: Panel,
    //meta: {requiresAuth: true} // Meta para rutas protegidas <- Descomentar para las cookies
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegación global
 router.beforeEach((to, from, next) => {
   const {estaAutenticado, inicializarAuth} = useAutenticacion()
  // Inicializar autenticación si no se ha hecho
   inicializarAuth()

   if (to.meta.requiresAuth && !estaAutenticado.value) {
     next('/login')
   } else {
     next()
   }
 })

export default router