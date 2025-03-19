<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const token = ref('');
const mostrarTokenForm = ref(false);

const login = () => {
  // Simula el envío del login y abre el formulario del token
  mostrarTokenForm.value = true;
};

const validarToken = () => {
  alert(`Token ingresado: ${token.value}`);
  mostrarTokenForm.value = false;
};

const cancelarToken = () => {
  mostrarTokenForm.value = false;
};
</script>

<template>
  <div class="container">
    <!-- Sección de la imagen -->
    <div class="left">
      <img src="../assets/ESCOM.jpg" alt="Imagen de Login" />
    </div>

    <!-- Sección del formulario de login -->
    <div class="right">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <input v-model="email" id="correo" type="email" placeholder="Correo electrónico" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>

    <!-- Modal de Token -->
    <div v-if="mostrarTokenForm" class="modal">
      <div class="modal-content">
        <h3>Ingrese su Token</h3>
        <input v-model="token" type="text" placeholder="Token de verificación" required />
        <div class="buttons">
          <button @click="validarToken">Validar</button>
          <button class="cancel" @click="cancelarToken">Cancelar</button>
        </div>
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
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  width: 80%;
}

input {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background: #3498db;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
}

button:hover {
  background: #2980b9;
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

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.cancel {
  background: #e74c3c;
}

.cancel:hover {
  background: #c0392b;
}
</style>