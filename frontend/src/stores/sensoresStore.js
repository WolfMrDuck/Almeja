import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSensoresStore = defineStore ('sensores', {
    state: () => ({
        mediciones: {
            voltajes: {
                solar: [],
                eolica: [],
                baterias: []
            },
            corrientes: {
                fuente: [],
                baterias: []
            },
            temperaturas: {
                sensor1: [],
                sensor2: [],
                sensor3: []
            }
        },
        periodoSeleccionado: 'hora',
        cargando: false,
        error: null,
        apiURL: ''
    }),//Fin de los estados (datos que se manejan globalmente)

    getters: {
        //Para voltajes...
        datosVoltajes: (state) => {
            return {
                labels: state.tiempoMediciones,
                datasets: [
                    {
                        label: 'Voltaje de Fuente Solar (V)',
                        data: state.mediciones.voltajes.solar,
                        borderColor: 'rgb(200, 181, 54)',
                        backgroundColor: 'rgba(200, 181, 54, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Voltaje de fuente Eólica (V)',
                        data: state.mediciones.voltajes.eolica,
                        borderColor: 'rgb(99, 182, 255)',
                        backgroundColor: 'rgba(99, 182, 255, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Voltaje de Banco de Baterías (V)',
                        data: state.mediciones.voltajes.baterias,
                        borderColor: 'rgb(54, 235, 166)',
                        backgroundColor: 'rgba(54, 235, 166, 0.1)',
                        tension: 0.1
                    }
                ]
            }
        },
        
        //Para corrientes...
        datosCorrientes: (state) => {
            return {
                labels: state.tiempoMediciones,
                datasets: [
                    {
                        label: 'Corriente de Fuente Solar (A)',
                        data: state.mediciones.corrientes.solar,
                        borderColor: 'rgb(200, 181, 54)',
                        backgroundColor: 'rgba(200, 181, 54, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Corriente de Fuente Eólica (A)',
                        data: state.mediciones.corrientes.eolica,
                        borderColor: 'rgb(99, 182, 255)',
                        backgroundColor: 'rgba(99, 182, 255, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Corriente de Banco de Baterías (A)',
                        data: state.mediciones.corrientes.baterias,
                        borderColor: 'rgb(54, 235, 166)',
                        backgroundColor: 'rgba(54, 235, 166, 0.1)',
                        tension: 0.1
                    }
                ]
            }
        },

        datosTemperaturas: (state) => {
            return {
                labels: state.tiempoMediciones,
                datasets: [
                    {
                        label: 'Primer conjunto de temperatura (°C)',
                        data: state.mediciones.temperaturas.sensor1,
                        borderColor: 'rgb(54, 235, 166)',
                        backgroundColor: 'rgba(54, 235, 166, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Segundo conjunto de temperatura (°C)',
                        data: state.mediciones.temperaturas.sensor2,
                        borderColor: 'rgb(54, 235, 166)',
                        backgroundColor: 'rgba(54, 235, 166, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Tercer conjunto de temperatura (°C)',
                        data: state.mediciones.temperaturas.sensor3,
                        borderColor: 'rgb(54, 235, 166)',
                        backgroundColor: 'rgba(54, 235, 166, 0.1)',
                        tension: 0.1
                    }
                ]
            }
        }


    },//Fin de los getters

    actions: {

    }

})