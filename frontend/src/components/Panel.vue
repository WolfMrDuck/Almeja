<template>
    <div class="container">
        <!-- <div class="encabezado">
            <h1 class="title">BIENVENIDO AL PANEL</h1>
        </div> -->

      <div class="panel">  
        <h1 class="title">BIENVENIDO AL PANEL</h1>      
        <div class="grid">
          <div class="card">
            <h2 class="subtitle">ENERGÍA POR HORA</h2>
            <!-- <LineChart /> -->
          </div>
          
          <div class="card">
            <h2 class="subtitle">PORCENTAJE</h2>
            <!-- <PieChart /> -->
          </div>
          
          <div class="card">
            <h2 class="subtitle">Fuente activa:</h2>
            <p> Energía de Aerogenerador: -- </p>
            <p> Energía de Panel solar: -- </p>
            <p> Energía Total generada: -- </p>
          </div>
          
          <div class="card battery-card">
            <h2 class="subtitle">Banco de Baterías</h2>
            <div class="battery-icon">
              <!-- <BatteryIcon /> -->
            </div>
            <p> Energía Total: -- </p>
            <p> Carga: % </p>
            <p> Temperatura: °C </p>
            <p> Estado operativo: Inactivo </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  //import LineChart from "@/components/LineChart.vue";
  //import PieChart from "@/components/PieChart.vue";
  //import BatteryIcon from "@/components/BatteryIcon.vue";
  </script>
  
  <style>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  
  .container {
    padding: 20px;
  }
  
  .panel {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    color: #007bff;
    font-size: 24px;
    font-weight: bold;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .card {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .subtitle {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  
  .battery-card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .battery-icon {
    margin: 10px 0;
  }
  </style>
  