<script setup>
  import { onMounted, onUnmounted, computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import GraficaLinea from '@/components/GraficaLinea.vue';
  import { useSensoresStore } from '@/stores/sensoresStore';
  import { useAutenticacionStore } from '@/stores/autenticacionStore';
  import { storeToRefs } from 'pinia';
  import BotonBase from '@/components/BotonBase.vue';
  import ModalAyuda from '@/components/ModalAyuda.vue';
  import "@/assets/panel.css"

const sensores = useSensoresStore();
const autenticacion = useAutenticacionStore();
const { fuenteActiva, medicionActual } = storeToRefs(sensores);

const router = useRouter();

//Manejo del header y menú
const headerPequeno = ref(false);
const menuAbierto = ref(false);
const mostrarInfo = ref(false);

const manejarScroll = () => {
  headerPequeno.value = window.scrollY > 50
};

const alternarMenu = () => {
  menuAbierto.value = !menuAbierto.value
};

const cerrarSesion = () => {
  autenticacion.logOut();
  menuAbierto.value = false;
  router.push('/login')
};

  // Cerrar menú al hacer clic fuera
const cerrarMenuFuera = (event) => {
  const boton = event.target.closest('.boton-menu')
  if (!boton && menuAbierto.value) {
    menuAbierto.value = false
  }
};

const actualizarGraficas = async() => {
  await sensores.cargarDatos();
};

const actualizarTarjetas = async() => {
  await sensores.cargarValorActual();
};

const actualizarTodo = async() => {
  await Promise.all([
   sensores.cargarDatos(),
   sensores.cargarValorActual()
  ]);
};

let intervaloGraficas;
let intervaloTarjetas;

onMounted(() => {
  actualizarGraficas();
  actualizarTarjetas();

  intervaloGraficas = setInterval (actualizarGraficas, 60_000); // cada minuto
  intervaloTarjetas = setInterval (actualizarTarjetas, 30_000); // cada 30 segundos

  window.addEventListener('scroll', manejarScroll);
  document.addEventListener('click', cerrarMenuFuera);
});

onUnmounted(() => {
  clearInterval(intervaloGraficas);
  clearInterval(intervaloTarjetas);

  window.removeEventListener('scroll', manejarScroll);
  document.removeEventListener('click', cerrarMenuFuera);
})
 
</script>

<template>
    <div class="contenedorGral">
      <div class="header" :class="{pequeno: headerPequeno}">
        <div class="contenido-header sombra fondoBlanco">
          <h1 class="bienvenida">BIENVENIDO AL PANEL</h1>

          <div class="botones-escritorio">
            <BotonBase class="boton-escritorio" tipo="secundario" @click="actualizarTodo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006b9f" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw-icon lucide-refresh-cw">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
              </svg>
              Actualizar
            </BotonBase>
            
            <BotonBase class="boton-escritorio" tipo="primario" @click="mostrarInfo = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fefdff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help"><circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
              </svg>
              Info.
            </BotonBase>
          
            <BotonBase class="boton-escritorio" tipo="secundario" @click="cerrarSesion">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006b9f" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out">
                <path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              </svg>
              Cerrar Sesión
            </BotonBase>
          </div>
          <!-- Menú hamburguesa para vista movil -->
          <button class="boton-menu" :class="{abierto: menuAbierto}" @click="alternarMenu"> <!-- este botón es diferente al componente BotonBase -->
              <div class="linea"></div>
              <div class="linea"></div>
              <div class="linea"></div>

              <div class="menu-desplegable" :class="{activo: menuAbierto}">
                <ul class="lista-menu">
                  <li class="opcion-menu" @click="actualizarTodo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006b9f" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw-icon lucide-refresh-cw">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
                    </svg>
                    Actualizar panel
                  </li>
                  <li class="opcion-menu" @click="mostrarInfo = true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006b9f" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help"><circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                    </svg>
                    Info.
                  </li>
                  <li class="opcion-menu" @click="cerrarSesion">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006b9f" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out">
                      <path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    </svg>
                    Cerrar Sesión
                  </li>
                </ul>
              </div>
          </button> <!-- fin menú hamburguesa -->
        </div> 
      </div><!-- fin del header -->
    
      <ModalAyuda :esVisible="mostrarInfo" @close="mostrarInfo = false"/>

      <!-- Cuerpo del panel -->
      <div class="grid">

        <div class="card sombra borde fondoBlanco g1">
          <div class="encabezado-card">
            <h3 class="titulo-card">Fuente Activa: {{fuenteActiva.nombre}}</h3>
          </div>
          <div class="contenedor-metricas">

            <div class="item-metricas">
              <div class="icono-metricas">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" stroke="#f39c12" 
                  stroke-width="1.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  class="lucide lucide-zap-icon lucide-zap">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
                </svg>
              </div>
              <div class="valor-metricas">
                {{fuenteActiva.voltaje}} <span class="unidad">V</span>
              </div>
              <p class="etiqueta-metricas">Voltaje actual</p>
              <p class="rango-metricas">Rango: 12-14V</p>
            </div>

            <div class="item-metricas">
              <div class="icono-metricas">
                <svg xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#3498db" 
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
              </div>
              <div class="valor-metricas">
                {{ fuenteActiva.corriente }} <span class="unidad">A</span>
              </div>
              <p class="etiqueta-metricas">Corriente actual</p>
              <p class="rango-metricas">Rango: 0-10A</p>
            </div>
          </div><!-- contenedor de iconos -->
        </div> <!-- fin del datos fuente actual -->

        <div class="card sombra fondoBlanco grafica-card g2">
            <GraficaLinea
              :etiquetas="sensores.etiquetasGrafica"
              :datasets="sensores.datosVoltajes"
              titulo="Voltajes (última hora)"
            />
        </div>

        <div class="card g4 sombra fondoBlanco borde">
          <div class="encabezado-card">
              <h3 class="titulo-card">Banco de Baterías</h3>
          </div>
          <div class="contenedor-temp">
            <div class="item-metricas">
              <div class="icono-metricas">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#3498db" 
                  stroke-width="1.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  class="lucide lucide-thermometer-icon lucide-thermometer">
                  <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
                </svg>
              </div>
              <div class="valor-metricas">
                {{ medicionActual.temperatura.promedio }} <span class="unidad">°C</span>
              </div>
              <p class="etiqueta-metricas">Temp. Promedio</p>
              <p class="rango-metricas">Rango: 0°C</p>
            </div>
            <div class="item-metricas">
              <div class="icono-metricas">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-icon lucide-battery"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/>
                </svg>
              </div>
              <div class="valor-metricas">
                {{ medicionActual.bateria.carga }} <span class="unidad">%</span>
              </div>
              <p class="etiqueta-metricas">Nivel de carga</p>
              <p class="rango-metricas">Rango:</p>
            </div>
          </div> 
        </div><!-- Fin g4 -->
        
        <div class="card sombra fondoBlanco grafica-card g5">
            <GraficaLinea
            :etiquetas="sensores.etiquetasGrafica"
            :datasets="sensores.datosTemperaturas"
            titulo="Temperaturas (última hora)"
            />
        </div><!-- Fin g5 -->
      </div> <!-- Fin div grid -->
    </div> <!-- Fin del contenedor general -->
</template>