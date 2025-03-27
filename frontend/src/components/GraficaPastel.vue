<script>
    import { Pie } from 'vue-chartjs';
    import { Chart as ChartJS,
        ArcElement,
        Tooltip,
        Legend } from 'chart.js';

        ChartJS.register(
        ArcElement,
        Tooltip, 
        Legend );

    export default{
        components: {Pie},
        data() {
            return{
                chartData: {
                    labels:[ 'Solar', 'Eólica', 'Banco de Baterías', 'CFE' ],
                    datasets: [
                        {
                            data: [40, 20, 80, 10],
                            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'], // Color de fondo
              
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
   <div class="contenedor-Pastel">
    <Pie :data="chartData" :options="chartOptions"/>
   </div>
</template>

<style>
 .contenedor-Pastel{
   height: 350px;
 }
</style>
