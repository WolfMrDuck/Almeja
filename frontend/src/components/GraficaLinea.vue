<script>
    import { Line } from 'vue-chartjs';
    import { Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale } from 'chart.js';

        ChartJS.register(
        Title,
        Tooltip, 
        Legend, 
        LineElement, 
        PointElement, 
        CategoryScale, 
        LinearScale);

    export default{
        components: {Line},
        data() {
            return{
                chartData: {
                    labels:[ 'January', 'February', 'March' ],
                    datasets: [
                        {
                            label: 'Energía Eolica',
                            data: [20, 10, 20],
                            backgroundColor: 'rgba(75, 192, 192, 0.5)', // Color de fondo
                            borderColor: 'rgb(75, 192, 192)', // Color del borde
                            borderWidth: 3, // Grosor de la línea
                            pointBackgroundColor: 'white', // Color de fondo de los puntos
                            pointBorderColor: 'rgb(75, 192, 192)', // Color del borde de los puntos
                            pointBorderWidth: 2, // Grosor del borde de los puntos
                            pointRadius: 6, // Tamaño de los puntos
                            pointHoverRadius: 8, // Tamaño de los puntos al pasar el mouse
                            fill: true, // Rellenar área bajo la línea
              
                        },
                        {
                            label: 'Energía Solar',
                            data: [10, 30, 56],
                            backgroundColor: 'rgba(234, 192, 192, 0.5)', // Color de fondo
                            borderColor: 'rgb(234, 192, 192)', // Color del borde
                            borderWidth: 3, // Grosor de la línea
                            pointBackgroundColor: 'white', // Color de fondo de los puntos
                            pointBorderColor: 'rgb(234, 192, 192)', // Color del borde de los puntos
                            pointBorderWidth: 2, // Grosor del borde de los puntos
                            pointRadius: 6, // Tamaño de los puntos
                            pointHoverRadius: 8, // Tamaño de los puntos al pasar el mouse
                            fill: true, // Rellenar área bajo la línea
                        } 
                    ],
                },
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        }
    }

</script>

<template>
   <div class="contenedor-Linea">
    <Line :data="chartData" :options="chartOptions"/>
   </div>
</template>

<style>
 .contenedor-Linea{
   height: 350px;
   
 }
</style>
