import { ref, computed } from "vue";

export function useModal() {
  const modalAbierto = ref(false);
  const modalTipo = ref(''); //alerta, token, validar
  // const mensajeAlerta = ref('');
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

  //Funciones para los modales
  // const mostrarAlerta = (mensaje) => {
  //   mensajeAlerta.value = mensaje;
  //   modalTipo.value = 'alerta';
  //   modalAbierto.value = true;
  // };

  const mostrarModal = (tipo) => {
    modalTipo.value = tipo;
    modalAbierto.value = true;
  };

  const cerrarModal = () => {
    modalAbierto.value = false;
  };

  return {
    modalAbierto,
    modalTipo,
    tituloModal,
    mensajeValidacion,
    mostrarModal,
    cerrarModal
  };
}
