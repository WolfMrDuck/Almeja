<script setup>
// Definición de props usando Composition API
const props = defineProps({
  // Tipo de botón: define el estilo visual
  tipo: {
    type: String,
    default: 'primario',
    validator: (valor) => ['primario', 'secundario', 'cancelar'].includes(valor)
  },
  // Tamaño del botón
  tamano: {
    type: String,
    default: 'normal',
    validator: (valor) => ['pequeno', 'normal', 'grande'].includes(valor)
  },
  // Si el botón está deshabilitado
  deshabilitado: {
    type: Boolean,
    default: false
  }
});

// Definimos los eventos que emitirá este componente
const emit = defineEmits(['click']);

// Función para manejar el clic en el botón
const manejarClic = () => {
  // Solo emitimos el evento si el botón no está deshabilitado
  if (!props.deshabilitado) {
    emit('click');
  }
};
</script>

<template>
  <button 
    class="boton-base" 
    :class="[`tipo-${tipo}`, `tamano-${tamano}`, { 'deshabilitado': deshabilitado }]"
    :disabled="deshabilitado"
    @click="manejarClic"
  >
    <!-- Slot para el contenido del botón -->
    <slot></slot>
  </button>
</template>

<style scoped>
.boton-base {
  display: inline-block;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  border: none;
}

/* Estilos según el tipo de botón #e9ecef */
.tipo-primario {
  background-color: var(--color-primario);
  color: var(--color-blanco);
}
.tipo-primario:hover {
  background-color: #2779bd;
}

.tipo-secundario {
  background-color: var(--color-blanco);
  color: var(--color-primario);
  border: 1.5px solid var(--color-primario);
}
.tipo-secundario:hover {
  background-color: var(--color-secundario-hover);
}

.tipo-cancelar {
  background-color: var(--color-rojo);
  color: var(--color-blanco);
}
.tipo-cancelar:hover {
  background-color: var(--color-rojo-hover);
}

/* Estilos según el tamaño del botón  */
.tamano-pequeno {
  padding: 5px 14px;
  font-size: 12px;
}
.tamano-normal {
  padding: 10px 18px;
  font-size: 14px;
}
.tamano-grande {
  padding: 12px 26px;
  font-size: 16px;
}

/* Estilos para botón deshabilitado */
.deshabilitado {
  background-color: var(--color-deshabilitado);
  opacity: 0.6;
  cursor: not-allowed;
}
.deshabilitado:hover {
  /* Anulamos los efectos hover cuando está deshabilitado */
  background-color: inherit;
}
</style>