<script>
    
</script>

<template>
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
</template>

<style>
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