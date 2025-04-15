<script setup>
    import { computed, onMounted } from 'vue';
    import BotonBase from '@/components/BotonBase.vue';
    import { useSensoresStore } from '@/stores/sensoresStore';
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

    const sensoresStore = useSensoresStore();

    // Obtener los datos procesados para la gráfica
    const datosGrafica = computed(() => {
        return {
            labels: '',
            datasets: [
                {
                    label: 'Fuente Solar',
                    data: sensoresStore.mediciones.voltajes.solar,
                    borderColor: 'rgb(200, 181, 54)',
                    backgroundColor: 'rgba(200, 181, 54, 0.1)',
                    tension: 0.1 
                },
                {
                    label: 'Fuente Eólica',
                    data: sensoresStore.mediciones.voltajes.eolica,
                    borderColor: 'rgb(99, 182, 255)',
                    backgroundColor: 'rgba(99, 182, 255, 0.1)',
                    tension: 0.1
                },
                {
                    label: 'Banco de Baterías',
                    data: state.mediciones.voltajes.baterias,
                    borderColor: 'rgb(54, 235, 166)',
                    backgroundColor: 'rgba(54, 235, 166, 0.1)',
                    tension: 0.1
                }
            ]
        };
    });

    // Opciones de la gráfica
    const opcionesGrafica = computed(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                Title: {
                    display: true,
                    text: obtenerTituloGrafico()
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
                        text: 'Voltaje (V)'
                    },
                    beginAtZero: false
                }
            }
        };
    });

    //Funcion para obtener el titulo según el periodo de tiempo
    const obtenerTituloGrafico = () => {
        if (sensoresStore.periodoSeleccionado === 'hora') {
            return 'Voltaje registrado en la última hora';
        } else if (sensoresStore.periodoSeleccionado === 'hoy') {
            return 'Voltaje registrado hoy';
        } else {
            return 'Voltaje registrado esta semana';
        }
    };

    //Al montar el componente, se cargan los datols de la última hora por defecto
    onMounted (() => {
        sensoresStore.cargarDatosUltimaHora();
    });

</script>

<template>
   <div class="contenedorGrafica">
    <div class="botones">
        <BotonBase tipo="secundario" @click="sensoresStore.cargarDatosUltimaHora">
            Última hora
        </BotonBase>
        <BotonBase tipo="secundario" @click="sensoresStore.cargarDatosUltimaHora">
            Hoy
        </BotonBase>
        <BotonBase tipo="secundario" @click="sensoresStore.cargarDatosUltimaHora">
            Esta semana
        </BotonBase>
    </div>
    <Line :data="datosGrafica" :options="opcionesGrafica"/>
   </div>
</template>

<style>
 .contenedorGrafica{
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
 }

 .botones {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
</style>
