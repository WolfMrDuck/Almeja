<script setup>
import { ref } from 'vue';

const props = defineProps({
    esVisible: Boolean,
})

const emit = defineEmits(['close'])

const secciones = [
    {
        titulo: 'Información General',
        contenido: 'Este panel permite visualizar información en tiempo real sobre el sistema de energías renovables. Incluye dos tarjetas informativas. Además, se ofrecen dos gráficas históricas.'
    },
    {
        titulo: 'Tarjeta: "Fuente Activa"',
        contenido: 'Esta tarjeta indica cual de las fuentes está activa, así como los valores de voltaje y corriente correspondientes a dicha fuente. El nombre de la fuente puede cambiar a cualquiera de las siguientes: Panel Solar, Aerogenerador, Banco de Baterías y CFE. Para el caso de la CFE, no se manejan los valores de voltaje y corriente.'
    },
    {
        titulo: 'Tarjeta: "Banco de Baterías"',
        contenido: 'Esta tarjeta muestra dos datos importantes para el estado del banco de baterías: la temperatura promedio y el nivel de carga.'
    },
    {
        titulo: 'Gráfica de Voltajes',
        contenido: 'La gráfica de voltajes muestra las mediciones de cada fuente a lo largo de la última hora.'
    },
    {
        titulo: 'Gráfica de Temperaturas',
        contenido: 'La gráfica de Temperaturas muestra las mediciones de cada sensor (instalados en el banco) a lo largo de la última hora.'
    },
    {
        titulo: '¿Cómo interactuar con las gráficas?',
        contenido: 'Si se encuentra en una computadora, ya sea de escritorio o laptop, pase el cursor por encima de la gráfica y se mostrará el tiempo en minutos, así como el voltaje de cada fuente. En caso de que se encuentre en un dispositivo móvil, solo oprima el área donde desee ver la información del gráfico. Si desea eliminar una línea del gráfico, haga "click" en cualquiera de los nombres de las fuentes que aparecen debajo del titulo "Voltajes". Para hacerla aparecer, solo haga "click" nuevamente en el nombre, espere a que se actualice la gráfica o haga "click" en el botón de acción "Actualizar".'
    },
    {
        titulo: 'Botones de acción principales',
        contenido: 'Estos se encuentran justo a lado del mensaje de bienvenida al panel. Cada uno tiene un objetivo distinto: "Actualizar" Permite recargar los datos de todo el panel; "Info." abre esta ventana con una descripción general del panel y sus componentes principales; "Cerrar Sesión" Finaliza la sesión actual y te redirige a la pantalla de ingreso de token.'
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
  overflow-y: auto;
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
    overflow-y: auto;
  }

  .sidebar-modal {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    overflow-y: auto;
  }

  .cuerpo-modal {
    width: 100%;
    overflow-y: auto;
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