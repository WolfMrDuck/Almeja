import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";

export const useSensoresStore = defineStore ('sensores', {
    state: () => ({
        // Instancia del composable API
        api: useApi(),

        //Resto de datos
        mediciones: {
            voltajes: {
                solar: [],
                eolica: [],
                baterias: []
            },
            temperaturas: {
                sensor1: [],
                sensor2: [],
                sensor3: []
            }
        },
        medicionActual: {
            voltaje: {
                solar: 0,
                eolica: 0,
                baterias: 0
            },
            corriente: {
                fuente: 0,
                baterias: 0
            },
            temperatura: {
                sensor1: 0,
                sensor2: 0,
                sensor3: 0
            },
            bateria: {
                carga: 0
            },
            estatus: {
                solar: false,
                eolica: false,
                baterias: false,
                carga: false,
                vca: false
            }
        },
        horaInicio: '',
        horaFin: '',
        rangoHoras: '',
        error: null
    }),//Fin de los estados (datos que se manejan globalmente)

    getters: {

        //Estados de carga de la API:
        cargandoAPI: (state) => state.api.cargando.valueOf,
        errorApi: (state) => state.api.error.value,

        fuenteActiva: (state) => {
            const { solar, eolica, baterias, vca } = state.medicionActual.estatus;
            
            if (solar) {
                return {
                    nombre: 'Panel Solar',
                    voltaje: state.medicionActual.voltaje.solar,
                    corriente: state.medicionActual.corriente.fuente
                };
            }
            if (eolica) {
                return {
                    nombre: 'Aerogenerador',
                    voltaje: state.medicionActual.voltaje.eolica,
                    corriente: state.medicionActual.corriente.fuente
                };
            }
            if (baterias) {
                return {
                    nombre: 'Banco de Baterías',
                    voltaje: state.medicionActual.voltaje.baterias,
                    corriente: state.medicionActual.corriente.baterias
                };
            }
            if (vca) {
                return {
                    nombre: 'CFE',
                    voltaje: '127',
                    corriente: '10000VA'
                };
            }
            return{
                nombre: 'Ninguna',
                voltaje: 0,
                corriente: 0
            };
        },
    },//Fin de los getters

    actions: {

        async cargarDatos(){
            this.cargando = true;

            //Cálculo de una hora antes: set-> modifica hora de un objeto Date, get-> trae la hora
            // const horaAnterior = new Date();
            // horaAnterior.setHours(horaAnterior.getHours() - 1);
            // const horaActual = new Date();

            // this.horaInicio = horaAnterior.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
            // this.horaFin = horaActual.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
            // this.rangoHoras = `${this.horaInicio} - ${this.horaFin}`;

            //Descomentar lo anterior y eliminar lo siguiente:
             const horaAnterior = new Date();
             horaAnterior.setDate(horaAnterior.getDate() - 34);
             horaAnterior.setHours(horaAnterior.getHours() - 1);

            try {
                const datos = await this.api.getApi('/measures/', {start_date: horaAnterior.toISOString()} );
                
                // Procesar los datos según la estructura de la API
                this.mediciones.voltajes.solar = datos.voltmeters.solar;
                this.mediciones.voltajes.eolica = datos.voltmeters.wind;
                this.mediciones.voltajes.baterias = datos.voltmeters.battery;

                this.mediciones.temperaturas.sensor1 = datos.thermometers.temp1;
                this.mediciones.temperaturas.sensor2 = datos.thermometers.temp2;
                this.mediciones.temperaturas.sensor3 = datos.thermometers.temp3;
                
                this.error = null;
            } catch (error) {
                console.log('Ocurrió un error: ', error);
                this.error = error.message;
            } finally {
                this.cargando = false;
            }
        },

         async cargarValorActual(){
            try {
                
                const dato = await this.api.getApi('/live/');


                this.medicionActual.voltaje.solar = dato.voltage.solar;
                this.medicionActual.voltaje.eolica = dato.voltage.wind;
                this.medicionActual.voltaje.baterias = dato.voltage.battery;

                this.medicionActual.corriente.fuente = dato.current.source;
                this.medicionActual.corriente.baterias = dato.current.battery;

                this.medicionActual.temperatura.sensor1 = dato.temperature.temp1;
                this.medicionActual.temperatura.sensor2 = dato.temperature.temp2;
                this.medicionActual.temperatura.sensor3 = dato.temperature.temp3;
                this.medicionActual.bateria.carga = dato.battery;

                this.medicionActual.estatus.solar = dato.status.solar;
                this.medicionActual.estatus.eolica = dato.status.wind;
                this.medicionActual.estatus.baterias = dato.status.battery;
                this.medicionActual.estatus.carga = dato.status.load;
                this.medicionActual.estatus.vca = dato.status.vca;


            } catch (error) {
                console.error("Error cargando el valor actual: ", error)
            }
        }
    }//Fin de actions
})