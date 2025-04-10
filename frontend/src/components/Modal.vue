<script setup>
// Importamos nuestro componente BotonBase
import BotonBase from './BotonBase.vue';

// Definición de props usando Composition API
const props = defineProps({
  // Controla si el modal está visible
  mostrar: {
    type: Boolean,
    default: false
  },
  // Título del modal
  titulo: {
    type: String,
    default: 'Modal'
  }
});

// Definimos los eventos que emitirá este componente
const emit = defineEmits(['cerrar']);

// Función para cerrar el modal
const cerrarModal = () => {
  emit('cerrar');
};

</script>

<template>
  <!-- El modal solo se muestra si la prop 'mostrar' es true -->
  <div v-if="mostrar" class="modal-fondo">
    <div class="modal-contenido">
      <!-- Cabecera del modal -->
      <div class="modal-cabecera">
        <h2>{{ titulo }}</h2>
        <button class="boton-cerrar" @click="cerrarModal">&times;</button>
      </div>
      
      <!-- Cuerpo del modal con slot para contenido personalizado -->
      <div class="modal-cuerpo">
        <slot></slot>
      </div>
      
      <!-- Pie del modal con botones reutilizables -->
      <div class="modal-pie">
        <slot name="footer">

          <BotonBase 
            tipo="primario" 
            @click="cerrarModal"
          >
            Cerrar
          </BotonBase>

        </slot>
      
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-fondo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: var(--color-primario);
}

.modal-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.modal-cabecera h2 {
  margin: 0;
  font-size: 18px;
}

.boton-cerrar {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.modal-cuerpo {
  padding: 15px;
  display: grid;
  place-items: center;
}

.modal-pie {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
}
</style>