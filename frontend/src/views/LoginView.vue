<script setup>
  import { ref,computed } from 'vue';
  import Modal from '@/components/Modal.vue';
  import BotonBase from '@/components/BotonBase.vue';
  
  //Estado para controlar la visibilidad de cada modal
  const modalAbierto = ref(false);
  const modalTipo = ref(''); //alerta, token, validar
  const tokenGenerado = ref('');
  const tokenIngresado = ref('');
  const mensajeAlerta = ref('');
  const mensajeValidacion = ref('');

  //Titulo del modal segun el tipo
  const tituloModal = computed(() => {
    switch (modalTipo.value) {
      case 'alerta': return 'Aviso';
      case 'token': return 'Generación de Token';
      case 'validar': return 'Validación';
      default: return 'Modal'
    }
  });

  //Funciones para abrir los modales
  const mostrarAlerta = (mensaje) => {
    mensajeAlerta.value = mensaje;
    modalTipo.value = 'alerta';
    modalAbierto.value = true;
  };

  const mostrarToken = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';

    for (let i = 0; i < 20; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    tokenGenerado.value = resultado;
    modalTipo.value = 'token';
    modalAbierto.value = true;
  };

  const mostrarValidarToken = () => {
    tokenIngresado.value = '';
    mensajeValidacion.value = '';
    modalTipo.value = 'validar';
    modalAbierto.value = true;
  };

  //Funciones de acción
  const copiarToken = () => {
    navigator.clipboard.writeText(tokenGenerado.value).then(() => {
      alert("Token copiado en el portapapeles");
    });
  };

  const validarToken = () => {
    if (tokenIngresado.value === tokenGenerado.value) {
      modalTipo.value = 'alerta';
      mensajeAlerta.value = '¡Token válido! Acceso concedido.';
    }else{
      mensajeValidacion.value = 'Token inválido. Inténtalo de nuevo.'
    }
  };

  const cerrarModal = () => {
    modalAbierto.value = false;
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
      <h1 class="title">BIENVENIDO</h1>
      <p></p>
      <p></p>
      <p></p>
      <BotonBase tipo="secundario" tamano="grande" @click="mostrarValidarToken">
        Iniciar Sesión
      </BotonBase>
      <div class="divider">
        <hr class="line" />
        <span class="text">o</span>
        <hr class="line" />
      </div>
      <BotonBase tipo="primario" tamano="grande" @click="mostrarToken">
        Generar Token
      </BotonBase>

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

        <template v-else-if="modalTipo === 'validar'">
          <p>Ingresa el token: </p>
          <input 
          v-model="tokenIngresado" 
          type="text" 
          placeholder="Ingresa tu token aquí"/>
          <p v-if="mensajeValidacion">{{ mensajeValidacion }}</p>
      </template>

      <template v-else-if="modalTipo === 'alerta'">
        <p>{{ mensajeAlerta }}</p>
      </template>

      <template #footer>
        <template v-if="modalTipo === 'validar'">
          <BotonBase tipo = "primario" @click = "validarToken">Validar</BotonBase>
          <BotonBase tipo = "cancelar" @click = "cerrarModal" >Cancelar</BotonBase>
        </template>

        <template v-else-if="modalTipo === 'token'">
          <BotonBase tipo = "primario" @click = "copiarToken">Copiar</BotonBase>
          <BotonBase tipo = "cancelar" @click = "cerrarModal" >Cerrar</BotonBase>
        </template>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
/* Diseño principal */
.container {
  display: flex;
  height: 100vh;
  padding: 0;
}

.left, .right {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right {
  flex-direction: column;
  background: #f4f4f4;
  padding: 40px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 47.5%;
  height: 100%;
  background-color: rgba(191, 223, 234, 49%); 
}

.title {
  font-size: 52px;
  font-family: Arial;
  font-weight: bold;
  color: #006B9F;
  margin-bottom: 20px;
}

.divider {
  display: flex;
  align-items: center;
  width: 250px;
  margin-bottom: 16px;
  margin-top: 16px;
}

.line {
  flex-grow: 1;
  border: none;
  height: 1px;
  background-color: #ccc;
}

.text {
  margin: 0 10px;
  color: #666;
}

input{
    max-width: 100%;
    height: 20px;
    border: none;
    border-radius: 8px;
    padding: 10px;
    background-color: rgba(88, 180, 225, 0.262);
    font-size: 18px;
    color: var(--color-primario);
  }
  
</style>