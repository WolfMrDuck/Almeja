<script setup>
  import GraficaLinea from '@/components/GraficaLinea.vue';
  import GraficaPastel from '@/components/GraficaPastel.vue';
  //import BatteryIcon from "@/components/BatteryIcon.vue";
  
</script>

<template>
    <div class="contenedorGral">
      <div class="encabezado sombra">
          <h1 class="title">BIENVENIDO AL PANEL</h1>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke=#006B9F stroke-linecap="round" stroke-linejoin="round" width="36" height="36" stroke-width="0.75">
            <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2"></path>
            <path d="M15 12h-12l3 -3"></path>
            <path d="M6 15l-3 -3"></path>
          </svg> <!-- este es el icono -->
      </div>

      <div class="panel">   

        <div class="grid">
          <div class="card g1">
            <h2 class="subtitle">ENERGÍA POR HORA</h2>
            <!-- <GraficaLinea /> -->
          </div>
          
          <div class="card g2">
            <h2 class="subtitle">PORCENTAJE</h2>
            <GraficaPastel />
          </div>
          
          <div class="card g3">
            <p>Fuente activa:</p>
            <p> Energía de Aerogenerador: -- </p>
            <p> Energía de Panel solar: -- </p>
            <p> Energía Total generada: -- </p>
          </div>
          
          <div class="card battery-icon">
            <h2 class="subtitle">Banco de Baterías</h2>
            <!-- <BatteryIcon /> -->
          </div>
          <div class="card battery-card">
            <p> Energía Total: -- </p>
            <p> Carga: % </p>
            <p> Temperatura: °C </p>
            <p> Estado operativo: Inactivo </p>
          </div>
        </div>
      </div> <!-- fin div panel -->
    </div>
</template>
  
<style>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }
  
  .contenedorGral {
    padding: 20px;
  }

  .sombra{ /* www.cssmatic.com/box-shadow  -> para la sombra */
    -webkit-box-shadow: 0px 5px 3px -3px rgba(112,112,112,0.59);
    -moz-box-shadow: 0px 5px 3px -3px rgba(112,112,112,0.59);
    box-shadow: 0px 5px 3px -3px rgba(112,112,112,0.59);
  }

  .encabezado {
    background: white;
    /*border: #006B9F solid;  esto es solo para ver el borde*/
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    color: #006B9F;
    font-size: 30px;
    font-weight: bold;
  }
  
  .panel {
    /* border: #006B9F solid;esto es solo para ver el borde */
    margin-top: 20px;
    padding: 40px;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 20px;
    margin-top: 20px;
  }
  
  .card {
    /* background: white; */
    /* border: #006B9F solid;esto es solo para ver el borde */
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .g1{
    grid-column: 1/3;
    grid-row: 1/2;
  }
  .g2{
    grid-column:1/2;
    grid-row: 2/3;
  }
  .g3{
    grid-column:2/3;
    grid-row: 2/3;
  }

  .subtitle {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  
  .battery-icon {
    grid-column: 3/4;
    grid-row: 1/2;
  }

  .battery-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-column: 3/4;
    grid-row: 2/3;
  }
  
</style>
  