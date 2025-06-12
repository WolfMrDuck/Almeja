<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAutenticacion } from '@/composables/useAutenticacion';
  import { useCookies } from '@/composables/useCookies';
  import BotonBase from '@/components/BotonBase.vue'; 
  import '@/assets/login.css' //Estilos de esta pantalla

// Variable para el uso de route
const router = useRouter();
//Composables
const {ingresarConToken, inicializarAuth, estaAutenticado} = useAutenticacion();
const {obtenerTodasLasCookies} = useCookies();
//Estado 
const tokenIngresado = ref('');
const mensajeError = ref('');
const cargandoLogin = ref(false);

//Si ya está autenticado, redirigir
onMounted(() => {
  inicializarAuth()
  if (estaAutenticado.value) {
    router.push('/panel')
  }
  console.log("Montado el login");
  console.log("Token:", obtenerTodasLasCookies());
})

const manejarLogin = async () => {
  mensajeError.value = ''
  cargandoLogin.value = true

  try {
    await ingresarConToken(tokenIngresado.value)
  } catch (error) {
    mensajeError.value = error.message
  }finally{
    cargandoLogin.value = false
  }
}
  
</script>

<template>
  <div class="container">
    <!-- Sección de la imagen -->
    <div class="left">
      <img src="../assets/img-fuentes.jpg" alt="Imagen de Login" />
    </div>

    <!-- Sección del login -->
    <div class="right">

      <div class="contenedor-login">
        <h1 class="titulo-login">BIENVENIDO</h1>
          <form class="login-form ancho" @submit.prevent="manejarLogin">
            <div class="grupo-form">
              <label for="token">Token de acceso: </label>
              <input 
                id="token"
                v-model="tokenIngresado"
                type="text"
                placeholder="Escribe tu token aquí"
                :disabled="cargandoLogin"
                required
                class="input-form"
              />
            </div>

            <BotonBase 
              tipo="primario" 
              tamano="grande" 
              class="ancho"
              tipoBoton="submit" 
              :deshabilitado="cargandoLogin || !tokenIngresado.trim()"
            >
              {{cargandoLogin ? 'Validando...' : 'Ingresar'}}
            </BotonBase>
            <div v-if="mensajeError" class="mensaje-error">
              {{ mensajeError }}
            </div>
          </form>     
      </div>
    </div> <!--fin div sección derecha -->
    
  </div><!--fin div container -->
</template>
<style>
  .mensaje-error {
  color: #e74c3c;
  margin-top: 10px;
  padding: 10px;
  background-color: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  font-size: 14px;
}
</style>