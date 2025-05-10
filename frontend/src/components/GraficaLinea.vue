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
import { ref, watch } from 'vue';

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
    const datosGrafica = ref({
        labels: props.etiquetas,
        datasets: props.datasets
    });

    // Watch para actualizar datos cuando cambien las props
    watch(
        () => [props.etiquetas, props.datasets],
        ([nuevasEtiquetas, nuevosDatasets]) => {
            datosGrafica.value = {
                labels: nuevasEtiquetas,
                datasets: nuevosDatasets
            };
        },
        { deep: true }
    );

    // Opciones de la gráfica
    const opcionesGrafica = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: props.titulo
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                display: true,
                position: 'top',
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tiempo'
                }
            },
            y: {
                title: {
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
