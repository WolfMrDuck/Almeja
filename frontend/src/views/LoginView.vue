<script>
  import ModalGenerarToken from './ModalGenerarToken.vue';
  import ModalToken from './ModalToken.vue';
  export default {
    name: "LoginView",
    components: {
      ModalToken,
      ModalGenerarToken,
    },
    data() {
      return {
        mostrarTokenForm: false,
        mostrarGeneradorToken: false,
      };
    },
    methods: {
      validarToken(Token){
        alert(`Token ingresado: ${Token}`);
        this.mostrarTokenForm = false;
      },
      
    },
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
      <button class="btn btn-outline" @click="mostrarTokenForm = true">Iniciar Sesión</button>
      
      <div class="divider">
        <hr class="line" />
        <span class="text">o</span>
        <hr class="line" />
      </div>

      <button class="btn btn-primary" @click="mostrarGeneradorToken = true">Generar Token</button>

    </div> <!--fin div sección derecha -->

    <!-- Modal Validación Token -->
    <ModalToken :mostrarTokenForm="mostrarTokenForm" @validar = "validarToken" @cerrar = "mostrarTokenForm = false"/>

    <!-- Modal Generación Token -->
    <ModalGenerarToken :mostrarGeneradorToken="mostrarGeneradorToken" @cerrar = "mostrarGeneradorToken = false"/>

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

.btn {
  width: 250px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 16px;
}

.btn-outline {
  border: 2px solid #006B9F;
  color: #006B9F;
  background-color: transparent;
}

.btn-outline:hover {
  background-color: #DBEAFE;
}

.btn-primary {
  background-color: #006B9F;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #006B9F;
}

.divider {
  display: flex;
  align-items: center;
  width: 250px;
  margin-bottom: 16px;
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
  
</style>