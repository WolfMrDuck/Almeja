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

        nivelCargaBaterias: (state) => {
            const voltaje = state.medicionActual.voltaje.baterias;
            const voltajeMax = 12.6;
            const voltajeMin = 9.0;

            // Calcular porcentaje
            let porcentaje = ((voltaje - voltajeMin) / (voltajeMax - voltajeMin)) * 100;
            porcentaje = Math.min(100, Math.max(0, porcentaje));

            return porcentaje.toFixed(1); // redondear a 1 decimal
        },

        promedioTemperaturas: (state) => {
            const { sensor1, sensor2, sensor3 } = state.medicionActual.temperatura;

            const temperaturas = [sensor1, sensor2, sensor3];

            // Si todas las temperaturas son 0, asumimos que no hay datos válidos
            const temperaturasValidas = temperaturas.filter(temp => temp !== 0);

            if (temperaturasValidas.length === 0) return 0;

            const suma = temperaturasValidas.reduce((acc, val) => acc + val, 0);
            return (suma / temperaturasValidas.length).toFixed(1);
        },

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
                    nombre: 'CFE'
                };
            }
            return{
                nombre: 'Ninguna',
                voltaje: 0,
                corriente: 0
            };
        }
    },//Fin de los getters

    actions: {

        async cargarDatos(){
            this.cargando = true;

            //Cálculo de una hora antes: set-> modifica hora de un objeto Date, get-> trae la hora
             const horaAnterior = new Date();
             horaAnterior.setHours(horaAnterior.getHours() - 6);
             const horaActual = new Date();

             this.horaInicio = horaAnterior.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
             this.horaFin = horaActual.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
             this.rangoHoras = `${this.horaInicio} - ${this.horaFin}`;

             console.log(this.horaInicio);
             console.log(this.horaFin)

            //Descomentar lo anterior y eliminar lo siguiente:
            //  const horaAnterior = new Date();
            //  horaAnterior.setDate(horaAnterior.getDate() - 34);
            //  horaAnterior.setHours(horaAnterior.getHours() - 1);

            try {
                const datos = await this.api.getApi('/measures/', {start_date: horaAnterior.toISOString()} );

                console.log('datos measure:', datos)
                
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

                console.log('datos actuales:', dato)

                this.medicionActual.voltaje.solar = dato.voltage.solar;
                this.medicionActual.voltaje.eolica = dato.voltage.wind;
                this.medicionActual.voltaje.baterias = dato.voltage.battery;

                this.medicionActual.corriente.fuente = dato.current.source;
                this.medicionActual.corriente.baterias = dato.current.battery;

                this.medicionActual.temperatura.sensor1 = dato.temperature.temp1;
                this.medicionActual.temperatura.sensor2 = dato.temperature.temp2;
                this.medicionActual.temperatura.sensor3 = dato.temperature.temp3;

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