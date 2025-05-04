<script setup>
    import { Line } from 'vue-chartjs';
    import { Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale, 
        plugins,
        scales} from 'chart.js';

    ChartJS.register(
        Title,
        Tooltip, 
        Legend, 
        LineElement, 
        PointElement, 
        CategoryScale, 
        LinearScale);

    //Propiedades
    const props = defineProps({
        etiquetas: {type: Array},
        datasets: {type: Array}, 
        titulo: {type: String, default: 'Gráfica'}
    });

    //Datos de la grafica
    const datosGrafica = {
        labels: props.etiquetas,
        datasets: props.datasets
    };

    // Opciones de la gráfica
    const opcionesGrafica = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            Title: {
                display: true,
                text: props.titulo
            },
            Tooltip: {
                mode: 'index',
                intersect: false,
            },
            Legend: {
                display: true,
                position: 'top',
            }
        },
        scales: {
            x: {
                Title: {
                    display: true,
                    text: 'Tiempo'
                }
            },
            y: {
                Title: {
                    display: true,
                    text: 'Valor'
                },
                beginAtZero: false
            }
        }
        
    };

</script>

<template>
   <div class="contenedorGrafica">
    <Line :data="datosGrafica" :options="opcionesGrafica"/>
   </div>
</template>

<style>
 .contenedorGrafica{
    width: 100%;
    height: 100%;
    margin: 0 auto;
 }
</style>
