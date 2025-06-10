<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAutenticacion } from '@/composables/useAutenticacion';
  import BotonBase from '@/components/BotonBase.vue'; 
  import '@/assets/login.css' //Estilos de esta pantalla

// Variable para el uso de route
const router = useRouter();
//Composables
const {ingresarConToken, cargandoAuth, estaAutenticado} = useAutenticacion();
//Estado 
const tokenIngresado = ref('');
const mensajeError = ref('');

//Si ya está autenticado, redirigir
onMounted(() => {
  if (estaAutenticado.value) {
    router.push('/panel')
  }
})

const manejarLogin = async () => {
  mensajeError.value = ''

  try {
    await ingresarConToken(tokenIngresado.value)
  } catch (error) {
    mensajeError.value = error.message
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
                :disabled="cargandoAuth"
                required
                class="input-form"
              />
            </div>

            <BotonBase 
              tipo="primario" 
              tamano="grande" 
              class="ancho"
              tipoBoton="submit" 
              :deshabilitado="cargandoAuth || !tokenIngresado.trim()"
            >
              {{cargandoAuth ? 'Validando...' : 'Ingresar'}}
            </BotonBase>
            <div v-if="mensajeError">
              {{ mensajeError }}
            </div>
          </form>     
      </div>
    </div> <!--fin div sección derecha -->
    
  </div><!--fin div container -->
</template>