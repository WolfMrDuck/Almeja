<script setup>
  import { onMounted, onUnmounted, computed, ref } from 'vue';
  import GraficaLinea from '@/components/GraficaLinea.vue';
  import { useSensoresStore } from '@/stores/sensoresStore';
  import { storeToRefs } from 'pinia';
  import BotonBase from '@/components/BotonBase.vue';
  import "@/assets/panel.css"

  const sensoresStore = useSensoresStore();
  const { ultimosDatos } = storeToRefs(sensoresStore);

  const voltajeSolar = computed(() =>
    ultimosDatos.value.find(v => v.nombre.includes('Voltaje Solar'))
  );
  const corrienteFuente = computed (() => 
    ultimosDatos.value.find(v => v.nombre.includes('Corriente Fuente'))
  );

  //Manejo del header y menú
  const headerPequeno = ref(false)
  const menuAbierto = ref(false)

  const manejarScroll = () => {
    headerPequeno.value = window.scrollY > 50
  }

  const alternarMenu = () => {
    menuAbierto.value = !menuAbierto.value
  }

  const cerrarSesion = () => {
    console.log('Cerrando sesión...')
    menuAbierto.value = false
  }

  const actualizarDatos = async() => {
    await sensoresStore.cargarDatos();
    console.log("Ultimos datos actualizados:", ultimosDatos.value);
  }

  // Cerrar menú al hacer clic fuera
const cerrarMenuFuera = (event) => {
  const boton = event.target.closest('.boton-menu')
  if (!boton && menuAbierto.value) {
    menuAbierto.value = false
  }
}

  let intervalo 

  onMounted(() => {
    actualizarDatos()
    intervalo = setInterval (actualizarDatos, 60_000)
    window.addEventListener('scroll', manejarScroll)
    document.addEventListener('click', cerrarMenuFuera)
    
  })

  onUnmounted(() => {
    clearInterval(intervalo)
    window.removeEventListener('scroll', manejarScroll)
    document.removeEventListener('click', cerrarMenuFuera)
  })
 
</script>

<template>
    <div class="contenedorGral">
      <div class="header" :class="{pequeno: headerPequeno}">
        <div class="contenido-header sombra fondoBlanco">
          <h1 class="bienvenida">BIENVENIDO AL PANEL</h1>
          <BotonBase id="boton-logout" tipo="secundario" @click="cerrarSesion">
            Cerrar Sesión
          </BotonBase>

          <!-- Menú hamburguesa para vista movil -->
          <button class="boton-menu" :class="{abierto: menuAbierto}" @click="alternarMenu"> <!-- este botón es diferente al componente BotonBase -->
              <div class="linea"></div>
              <div class="linea"></div>
              <div class="linea"></div>

              <div class="menu-desplegable" :class="{activo: menuAbierto}">
                <ul class="lista-menu">
                  <li class="opcion-menu" @click="cerrarSesion">
                    Cerrar Sesión
                  </li>
                </ul>
              </div>
          </button> <!-- fin menú hamburguesa -->

        </div> 
      </div><!-- fin del header -->
  

  <!-- Cuerpo del panel -->
      <div class="grid">
        <div class="card g1">
          <div class="card sombra fondoBlanco icono">
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" stroke="#006b9f" 
              stroke-width="1.5" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              class="lucide lucide-zap-icon lucide-zap">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
            </svg>
            <p class="datos">{{voltajeSolar.valor ?? '---'}} {{ voltajeSolar.unidad ?? ''}}</p>
          </div>

          <div class="card sombra fondoBlanco icono">
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#006b9f" 
              stroke-width="1.5" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              class="lucide lucide-plug2-icon lucide-plug-2">
              <path d="M9 2v6"/>
              <path d="M15 2v6"/>
              <path d="M12 17v5"/>
              <path d="M5 8h14"/>
              <path d="M6 11V8h12v3a6 6 0 1 1-12 0Z"/>
            </svg>
            <p class="datos">{{corrienteFuente.valor ?? '---'}} {{ corrienteFuente.unidad ?? '' }}</p>
          </div>
          <div class="card icono">
            <BotonBase tipo="primario" tamano="grande" @click="actualizarDatos">
                Actualizar datos
            </BotonBase> 
          </div>

        </div>

        <div class="card sombra fondoBlanco grafica-card g2">
            <GraficaLinea
              :etiquetas="sensoresStore.etiquetasGrafica"
              :datasets="sensoresStore.datosVoltajes"
              titulo="Voltajes (última hora)"
            />
        </div>
        
        <div class="card sombra fondoBlanco grafica-card g4">
            <GraficaLinea
            :etiquetas="sensoresStore.etiquetasGrafica"
            :datasets="sensoresStore.datosTemperaturas"
            titulo="Temperaturas (última hora)"
            />
        </div>
        
        <div class="card g5">
          <div class="cont-temp">
            <div class="card sombra fondoBlanco icono">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#006b9f" 
                  stroke-width="1.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  class="lucide lucide-thermometer-icon lucide-thermometer">
                  <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
                </svg>
                <p class="datos">Temp</p>
            </div>
          </div> 
        </div><!-- Fin g5 -->
      </div> <!-- Fin div grid -->
    </div> <!-- Fin del contenedor general -->
</template>