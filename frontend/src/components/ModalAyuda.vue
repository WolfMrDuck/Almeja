<script setup>
import { ref } from 'vue';

const props = defineProps({
    esVisible: Boolean,
})

const emit = defineEmits(['close'])

const secciones = [
    {
        titulo: 'Información General',
        contenido: 'Este panel muestra datos relacionados con las fuentes de energía renovable.'
    },
    {
        titulo: 'Gráfica de Voltajes',
        contenido: 'Muestra los voltajes registrados por el sistema dentro de la última hora. El valor máximo debe ser de 12V.'
    },
    {
        titulo: 'Corriente',
        contenido: 'Indica la corriente que fluye por el sistema. Corriente negativa indica que las baterías se están descargando.'
    },
    {
        titulo: 'Gráfica de Temperaturas.',
        contenido: 'Monitorea la temperatura del banco de baterías. Este muestra el comportamiento registrado dentro de la última hora.'
    },
    {
        titulo: 'Banco de Baterías',
        contenido: 'Muestra tanto la temperatura promedio como el nivel de carga del banco.'
    },
]

const seccionSelecionada = ref(secciones[0])

</script>

<template>
    <div v-if="esVisible" class="contenedor-modal" @click.self="$emit('close')">
        <div class="contenido-modal">
            <aside class="sidebar-modal">
                <h2 class="titulo-modal">Información</h2>
                <ul class="menu-modal">
                    <li
                    v-for="(item, index) in secciones"
                    :key="index"
                    :class="{activo: seccionSelecionada.titulo === item.titulo}"
                    @click="seccionSelecionada = item">
                    {{ item.titulo }}
                    </li>
                </ul>
            </aside>

            <section class="cuerpo-modal">
                <div class="cabecera-modal">
                    <h3 class="titulo-modal">{{ seccionSelecionada.titulo }}</h3>
                    <button @click="$emit('close')" class="close-button">&times;</button>
                </div>
                <p class="texto-modal">{{ seccionSelecionada.contenido }}</p>
            </section>
        </div>
    </div>
</template>

<style scoped>
.contenedor-modal{
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.contenido-modal{
  background: var(--color-blanco);
  display: flex;
  border-radius: 8px;
  width: 60%;
  max-width: 700px;
  height: 50%;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
.sidebar-modal{
  width: 35%;
  border-right: 1px solid #e5e5e5;
  padding: 1.5rem;
  box-sizing: border-box;
  background-color: #f6f6f6;
  overflow-y: auto;
  max-width: 100%;
}
.titulo-modal{
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-letras);
}
.menu-modal{
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu-modal li{
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  color: #333;
  transition: background 0.2s; 
}
.menu-modal li:hover{
  background-color: #f0f0f0;
}
.menu-modal li.activo {
  background-color: var(--color-secundario-hover);
  color:var(--color-primario);
  font-weight: 500;
}
.cuerpo-modal{
  width: 65%;
  padding: 1.5rem;
  box-sizing: border-box;
}
.cabecera-modal{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.texto-modal{
  margin-top: 1rem;
  line-height: 1.6;
  color: #444;
}
.close-button {
  font-size: 1.5rem;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1;
}
.close-button:hover {
  color: #333;
}

@media (max-width: 768px) {
  .contenido-modal {
    flex-direction: column;
    width: 70%;
    height: auto;
    max-height: 80%;
    overflow: hidden;
  }

  .sidebar-modal {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    overflow-y: auto;
  }

  .cuerpo-modal {
    width: 100%;
  }

  .cabecera-modal {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .close-button {
    align-self: flex-end;
    margin-top: 0.5rem;
  }
}
</style>