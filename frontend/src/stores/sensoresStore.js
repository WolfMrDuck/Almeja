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
            switches: {
                solar: false,
                eolica: false,
                baterias: false
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
            const { solar, eolica, baterias } = state.medicionActual.switches;
            
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
                
                const dato = await this.api.getApi('/actual/');

                this.medicionActual.voltaje.solar = dato.voltmeters.solar;
                this.medicionActual.voltaje.eolica = dato.voltmeters.wind;
                this.medicionActual.voltaje.baterias = dato.voltmeters.battery;

                this.medicionActual.corriente.fuente = dato.ammeters.source;
                this.medicionActual.corriente.baterias = dato.ammeters.battery;

                this.medicionActual.temperatura.sensor1 = dato.thermometers.temp1;
                this.medicionActual.temperatura.sensor2 = dato.thermometers.temp2;
                this.medicionActual.temperatura.sensor3 = dato.thermometers.temp3;
                this.medicionActual.bateria.carga = dato.battery;

                this.medicionActual.switches.solar = dato.switch.solar;
                this.medicionActual.switches.eolica = dato.switch.wind;
                this.medicionActual.switches.baterias = dato.switch.battery;

            } catch (error) {
                console.error("Error cargando el valor actual: ", error)
            }
        }
    }//Fin de actions
})