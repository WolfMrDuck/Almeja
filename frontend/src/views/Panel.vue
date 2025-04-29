<script setup>
  import GraficaLinea from '@/components/GraficaLinea.vue';
  import GraficaPastel from '@/components/GraficaPastel.vue';
  import "@/assets/panel.css"
  import BotonBase from '@/components/BotonBase.vue';
  
</script>

<template>
    <div class="contenedorGral">
      <div class="encabezado sombra">
          <h1 class="bienvenida">BIENVENIDO AL PANEL</h1>
          <button class="boton-logout">
            <svg xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke=#006B9F 
              stroke-linecap="round" 
              stroke-linejoin="round"
              width="36" 
              height="36" 
              stroke-width="1">
              <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2"></path>
              <path d="M15 12h-12l3 -3"></path>
              <path d="M6 15l-3 -3"></path>
            </svg> <!-- logout -->
          </button>
      </div> <!-- fin del encabezado -->

      <div class="panel">   

        <div class="grid">

          <div class="card g1">
            <div class="card sombra-card icono">
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
              <p>Voltaje</p>
            </div>

            <div class="card sombra-card icono">
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
              <p>Corriente</p>
            </div>

            <div class="card sombra-card icono">
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
              <p>Temperatura</p>
            </div>
          </div>

          <div class="card sombra-card g2">
            <h2 class="subtitle">Grafica voltajes</h2>
            <!-- <GraficaPastel /> -->
             <!-- <GraficaLinea /> -->
          </div>
          
          <div class="card g3">
            <div class="contenedor">
              <BotonBase tipo="primario" tamano="grande">
                Actualizar
              </BotonBase>  
            </div>
          </div>
          
          <div class="card sombra-card g4">
            <h2 class="subtitle">Temperaturas de Banco de Baterías</h2>
          </div>
          
          <div class="card g5">
            <div class="contenedor">
              <BotonBase tipo="primario" tamano="grande">
                Actualizar
              </BotonBase>  
            </div>
          </div>
        </div> <!-- Fin div grid -->
      </div> <!-- fin div panel -->
    </div> <!-- Fin del contenedor general -->
</template>