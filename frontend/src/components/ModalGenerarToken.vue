<script>
    export default{
        props: {
            mostrarGeneradorToken: Boolean,
        },
        data(){
            return{
                token: "",
            }
        },
        mounted(){
            this.generarToken()
        },
        methods: {
            generarToken(){
                //simulación de generación del token. Esto debe pedirse al back
                this.token = Date.now().toString().slice(-9);
            },
            copiarToken(){
                navigator.clipboard.writeText(this.token).then(() => {
                    alert("Token copiado en el portapapeles");
                });
            },
            cerrarModal(){
                this.$emit("cerrar");
            },
        },
    };
</script>

<template>
    <div v-if="mostrarGeneradorToken" class="modal">
      <div class="modal-content">
        <h3 class="text-mod">Se ha generado su token de acceso:</h3>

        <input type="text" :value="token" readonly />

        <p> <span>El token será válido por X días.</span> Por favor, 
          copie y guarde el token en un lugar seguro. No comparta este token con nadie 
          para proteger la seguridad de la cuenta.
        </p>

        <div class="cont-btn">
        <button class="m-button btn-primary" @click="copiarToken">Copiar</button>
        <button class="m-button cancel" @click="cerrarModal">Cerrar</button>
        </div>

      </div>
    </div> 
</template>

<style>
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
  width: 35%;
}

.cont-btn{
  display: flex;
  justify-content: space-evenly;
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