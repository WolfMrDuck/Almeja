<script setup>
  import { ref } from 'vue';
  import Modal from '@/components/Modal.vue';
  import BotonBase from '@/components/BotonBase.vue';
  import { useModal } from '@/composables/useModal';
  import { useAutenticacion } from '@/composables/useAutenticacion';
  import '@/assets/login.css' //Estilos de esta pantalla

//Composables (logica)
const { tokenGenerado, generarToken, validarToken, redirigirAPanel } = useAutenticacion();
const { modalAbierto, modalTipo, tituloModal, mensajeValidacion, mostrarModal, cerrarModal } = useModal();
//Estado 
const tokenIngresado = ref('');

//Acciones
  const mostrarGenerarToken = () => {
    generarToken();
    mostrarModal('token');
  };

  const mostrarInicioSesion = () => {
    tokenIngresado.value = '';
    mensajeValidacion.value = '';
    mostrarModal('validar');
  };

  const copiarToken = () => {
    navigator.clipboard.writeText(tokenGenerado.value).then(() => {
      alert("Token copiado en el portapapeles");
    });
  };

  const validacionToken = () => {
    if (validarToken(tokenIngresado.value)) {
      mensajeValidacion.value = '¡Token válido! Acceso concedido. Redirigiendo...';
      setTimeout(() => {
        cerrarModal();
        redirigirAPanel();
      }, 1500);
    } else {
      mensajeValidacion.value = 'Token inválido. Inténtalo de nuevo.';
    }
  };
</script>

<template>
  <div class="container">
    <!-- Sección de la imagen -->
    <div class="left">
      <img src="../assets/img-fuentes.jpg" alt="Imagen de Login" />
      <!-- <div class="overlay"></div> -->
    </div>

    <!-- Sección del login -->
    <div class="right">

      <div class="contenedor espacio">
        <h1 class="titulo">BIENVENIDO</h1>
        <div class="contenedor">
          
          <BotonBase tipo="secundario" tamano="grande" class="ancho" @click="mostrarInicioSesion">
            Iniciar Sesión
          </BotonBase>
          
          <div class="divider">
            <hr class="line" />
            <span class="text">o</span>
            <hr class="line" />
          </div>
    
          <BotonBase tipo="primario" tamano="grande" class="ancho" @click="mostrarGenerarToken">
            Generar Token
          </BotonBase>
        </div>      
      </div>

    </div> <!--fin div sección derecha -->

    <!--Modal -->
    <Modal
      :mostrar="modalAbierto"
      :titulo="tituloModal"
      @cerrar="cerrarModal"
    >
      <!--Contenido personalizado según el tipo de modal -->
        <template v-if="modalTipo === 'token' ">
          <p class="token">{{ tokenGenerado }}</p>

          <p><span style="font-weight: bold;">El token será válido por X días.</span> Por favor, 
          copie y guarde el token en un lugar seguro. No comparta este token con nadie 
          para proteger la seguridad de la cuenta.</p>
        </template>

        <template v-else="modalTipo === 'validar'">
          <p>Ingrese el token: </p>
          <input 
          v-model="tokenIngresado" 
          type="text" 
          placeholder="Ingresa tu token aquí"/>
          <p v-if="mensajeValidacion">{{ mensajeValidacion }}</p>
        </template>
      <!-- <template v-else-if="modalTipo === 'alerta'">
        <p>{{ mensajeAlerta }}</p>
      </template> -->
      <template #footer>
        <template v-if="modalTipo === 'validar'">
          <BotonBase tipo = "primario"  @click = "validacionToken">Validar</BotonBase>
          <BotonBase tipo = "cancelar"  @click = "cerrarModal" >Cancelar</BotonBase>
        </template>
        <template v-else-if="modalTipo === 'token'">
          <BotonBase tipo = "primario" @click = "copiarToken">Copiar</BotonBase>
          <BotonBase tipo = "cancelar" @click = "cerrarModal" >Cerrar</BotonBase>
        </template>
      </template>
    </Modal>
  </div>
</template>