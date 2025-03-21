<script setup>
  import { ref } from 'vue';
    const token = ref('');
    const mostrarTokenForm = ref(false);

    const validarToken = () => {
        alert(`Token ingresado: ${token.value}`);
        mostrarTokenForm.value = false;
    };

    const cancelarToken = () => {
        mostrarTokenForm.value = false;
    };

    const mostrarGeneradorToken = ref(false);

    const copiarToken = () => {
      alert('Token copiado');
      mostrarGeneradorToken.value = false;
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
      <h1 class="title">BIENVENIDO</h1>
      <button class="btn btn-outline" @click="mostrarTokenForm = true">Iniciar Sesión</button>
      
      <div class="divider">
        <hr class="line" />
        <span class="text">o</span>
        <hr class="line" />
      </div>

      <button class="btn btn-primary" @click="mostrarGeneradorToken = true">Generar Token</button>

    </div> <!--fin div sección derecha -->

    <!-- Modal de Token -->
    <div v-if="mostrarTokenForm" class="modal">
      <div class="modal-content">
        <h3>Por favor, ingrese el token de acceso</h3>
        <input v-model="token" type="text" placeholder="Token de verificación" required />
        <div class="modal-btn">
          <button class="m-button btn-primary" @click="validarToken">Validar</button>
          <button class="m-button cancel" @click="cancelarToken">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Generación -->
    <div v-if="mostrarGeneradorToken" class="modal">
      <div class="modal-content">
        <h3 class="text-mod">Se ha generado su token de acceso:</h3>

        <p> <span>El token será válido por X días.</span> Por favor, 
          copie y guarde el token en un lugar seguro. No comparta este token con nadie 
          para proteger la seguridad de la cuenta.
        </p>

        <button class="m-button btn-primary" @click="copiarToken">Copiar</button>
        <button class="m-button cancel" @click="mostrarGeneradorToken = false">Cerrar</button>

      </div>
      
    </div>

  </div>
</template>

<style scoped>
/* Diseño principal */
.container {
  display: flex;
  height: 100vh;
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

.title {
  font-size: 32px;
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

   /* Estilos del modal */
  .modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.modal-btn {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.m-button{
  width: 100px;
  padding: 12px;
  border-radius: 10px;
  font-weight: bold;
}

.btn-primary {
  background-color: #006B9F;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #006B9F;
}

.cancel {
  background: #E94D4D;
  color: #ffffff;
  border: #E94D4D;
}

.cancel:hover {
  background: #E94D4D;
  color: #ffffff;
}

</style>