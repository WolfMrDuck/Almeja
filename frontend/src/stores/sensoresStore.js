import { defineStore } from "pinia";

export const useSensoresStore = defineStore ('sensores', {
    state: () => ({
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
                promedio: 0
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
        etiquetasTiempo:[],
        cargando: false,
        error: null,
        apiURL: 'http://localhost:8080/measures/'
    }),//Fin de los estados (datos que se manejan globalmente)

    getters: {
        etiquetasGrafica: (state) => {
            return state.etiquetasTiempo;
        },

        //Para voltajes...
        datosVoltajes: (state) => [
            {
                label: 'Fuente Solar (V)',
                data: state.mediciones.voltajes.solar,
                borderColor: 'rgb(200, 181, 54)',
                backgroundColor: 'rgba(200, 181, 54, 0.1)',
                tension: 0.1
            },
            {
                label: 'Fuente Eólica (V)',
                data: state.mediciones.voltajes.eolica,
                borderColor: 'rgb(99, 182, 255)',
                backgroundColor: 'rgba(99, 182, 255, 0.1)',
                tension: 0.1
            },
            {
                label: 'Banco de Baterías (V)',
                data: state.mediciones.voltajes.baterias,
                borderColor: 'rgb(54, 235, 166)',
                backgroundColor: 'rgba(54, 235, 166, 0.1)',
                tension: 0.1
            }
        ],
        
        //Para temperaturas...
        datosTemperaturas: (state) => [
            {
                label: 'Sensor 1 (°C)',
                data: state.mediciones.temperaturas.sensor1,
                borderColor: 'rgb(54, 235, 166)',
                backgroundColor: 'rgba(54, 235, 166, 0.1)',
                tension: 0.1
            },
            {
                label: 'Sensor 2 (°C)',
                data: state.mediciones.temperaturas.sensor2,
                borderColor: 'rgb(54, 235, 166)',
                backgroundColor: 'rgba(54, 235, 166, 0.1)',
                tension: 0.1
            },
            {
                label: 'Sensor 3 (°C)',
                data: state.mediciones.temperaturas.sensor3,
                borderColor: 'rgb(54, 235, 166)',
                backgroundColor: 'rgba(54, 235, 166, 0.1)',
                tension: 0.1
            }
        ],

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

        generarEtiquetasTiempo(numIntervalos){
            const horaActual = new Date();
            const horaAnt = new Date(horaActual.getTime() - 60 * 60 * 1000);
            
            const intervaloTiempo = (horaActual.getTime() - horaAnt.getTime()) / (numIntervalos - 1);

            const etiquetas = [];
            for (let index = 0; index < numIntervalos; index++) {
                const tiempoPunto = new Date(horaAnt.getTime() + intervaloTiempo * index);
                const horas = tiempoPunto.getHours().toString().padStart(2, '0');
                const minutos = tiempoPunto.getMinutes().toString().padStart(2, '0');
                etiquetas.push(`${horas}:${minutos}`)
                console.log(`Etiqueta ${index}: ${horas}:${minutos}`);

            }
            this.etiquetasTiempo = etiquetas;
        },

        normalizarDatos() {
            const longitudEtiquetas = this.etiquetasTiempo.length;

            const normalizarArreglo = (arreglo) => {
                if (arreglo.length === 0) {
                    // Si no hay datos, rellenar con ceros
                    return Array(longitudEtiquetas).fill(0);
                } else if (arreglo.length < longitudEtiquetas) {
                    // Si hay menos datos que etiquetas, rellenar con valores nulos
                    return [...arreglo, ...Array(longitudEtiquetas - arreglo.length).fill(null)]
                } else if (arreglo.length > longitudEtiquetas) {
                    // Si hay más datos que etiquetas, hacer un submuestreo
                    const resultado = [];
                    const salto = arreglo.length / longitudEtiquetas;
                    for (let i = 0; i < longitudEtiquetas; i++) {
                        const indice = Math.floor(i * salto);
                        resultado.push(arreglo[indice]);
                    }
                    return resultado;
                }
                // Si la longitud es correcta, devolver el arreglo original
                return arreglo;
            };
            // Normalizar todos los arreglos de datos
            // Voltajes
            this.mediciones.voltajes.solar = normalizarArreglo(this.mediciones.voltajes.solar);
            this.mediciones.voltajes.eolica = normalizarArreglo(this.mediciones.voltajes.eolica);
            this.mediciones.voltajes.baterias = normalizarArreglo(this.mediciones.voltajes.baterias);
             
            // Temperaturas
            this.mediciones.temperaturas.sensor1 = normalizarArreglo(this.mediciones.temperaturas.sensor1);
            this.mediciones.temperaturas.sensor2 = normalizarArreglo(this.mediciones.temperaturas.sensor2);
            this.mediciones.temperaturas.sensor3 = normalizarArreglo(this.mediciones.temperaturas.sensor3);
        },

        async cargarDatos(){
            this.cargando = true;

            // Generar las etiquetas de tiempo al cargar los datos
            this.generarEtiquetasTiempo(12);
            console.log("Etiquetas generadas:", this.etiquetasTiempo);

            //Cálculo de una hora antes: set-> modifica hora de un objeto Date, get-> trae la hora
            // const horaAnterior = new Date();
            // horaAnterior.setHours(horaAnterior.getHours() - 1)
            // console.log(horaAnterior);

            //Hay que cambiar esto antes de hacer la prueba con la API
            const horaAnterior = new Date();
            horaAnterior.setDate(horaAnterior.getDate() - 12);
            horaAnterior.setHours(horaAnterior.getHours() - 1);

            try {
                const respuesta = await fetch(`${this.apiURL}?start_date=${horaAnterior.toISOString()}`);
                //Verificamos si fue exitosa la respuesta
                if (!respuesta.ok) {
                    throw new Error('Error al obtener los datos');
                }
                //Convertimos la respuesta a json
                const datos = await respuesta.json();
                // Procesar los datos según la estructura de la API
                this.mediciones.voltajes.solar = datos.voltmeters.solar;
                this.mediciones.voltajes.eolica = datos.voltmeters.wind;
                this.mediciones.voltajes.baterias = datos.voltmeters.battery;

                this.mediciones.temperaturas.sensor1 = datos.thermometers.temp1;
                this.mediciones.temperaturas.sensor2 = datos.thermometers.temp2;
                this.mediciones.temperaturas.sensor3 = datos.thermometers.temp3;
                // Normalizar datos para que coincidan con las etiquetas
                this.normalizarDatos();
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
                const respuesta = await fetch(`${this.apiURL}`); //Cambiar la url
                if (!respuesta.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const dato = await respuesta.json();

                this.medicionActual.voltaje.solar = dato.voltmeters.solar;
                this.medicionActual.voltaje.eolica = dato.voltmeters.wind;
                this.medicionActual.voltaje.baterias = dato.voltmeters.battery;

                this.medicionActual.corriente.fuente = dato.ammeters.source;
                this.medicionActual.corriente.baterias = dato.ammeters.battery;

                this.medicionActual.temperatura.promedio = dato.thermometer.prom;
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