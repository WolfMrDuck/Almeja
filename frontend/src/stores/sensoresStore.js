import { defineStore } from "pinia";

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
        cargando: false,
        error: null,
        apiURL: 'http://url-api/datos'
    }),//Fin de los estados (datos que se manejan globalmente)

    getters: {

        etiquetasVoltajes: (state) => {
            //suponiendo que todos los datos tendrán la misma hora y orden de registro:
            //de ser así, entonces basta con usar las etiquetas de una fuente.
            state.mediciones.voltajes.solar.map(v => v.tiempo)
        },

        //Para voltajes...
        datosVoltajes: (state) => [
            {
                label: 'Fuente Solar (V)',
                data: state.mediciones.voltajes.solar.map(v => v.valor),
                borderColor: 'rgb(200, 181, 54)',
                backgroundColor: 'rgba(200, 181, 54, 0.1)',
                tension: 0.1
            },
            {
                label: 'Fuente Eólica (V)',
                data: state.mediciones.voltajes.eolica.map(v => v.valor),
                borderColor: 'rgb(99, 182, 255)',
                backgroundColor: 'rgba(99, 182, 255, 0.1)',
                tension: 0.1
            },
            {
                label: 'Banco de Baterías (V)',
                data: state.mediciones.voltajes.baterias.map(v => v.valor),
                borderColor: 'rgb(54, 235, 166)',
                backgroundColor: 'rgba(54, 235, 166, 0.1)',
                tension: 0.1
            }
        ],
        
        //Para temperaturas...
        datosTemperaturas: (state) => [
            {
                label: 'Sensor 1 (°C)',
                data: state.mediciones.temperaturas.sensor1.map(t => t.valor),
                borderColor: 'rgb(54, 235, 166)',
                backgroundColor: 'rgba(54, 235, 166, 0.1)',
                tension: 0.1
            },
            {
                label: 'Sensor 2 (°C)',
                data: state.mediciones.temperaturas.sensor2.map(t => t.valor),
                borderColor: 'rgb(54, 235, 166)',
                backgroundColor: 'rgba(54, 235, 166, 0.1)',
                tension: 0.1
            },
            {
                label: 'Sensor 3 (°C)',
                data: state.mediciones.temperaturas.sensor3.map(t => t.valor),
                borderColor: 'rgb(54, 235, 166)',
                backgroundColor: 'rgba(54, 235, 166, 0.1)',
                tension: 0.1
            }
        ],
            
       

        ultimosDatos: (state) => {
            //Funcion para obtener el ultimo valor de los arreglos
            const obtenerUltimo = arr => arr.at(-1) ?? {valor: 0, tiempo: '--'}
        
            return [
                {
                    titulo: 'Voltaje Solar',
                    valor: obtenerUltimo(state.mediciones.voltajes.solar).valor,
                    hora: obtenerUltimo(state.mediciones.voltajes.solar).tiempo,
                    unidad: 'V'
                },
                {
                    titulo: 'Voltaje Eólico',
                    valor: obtenerUltimo(state.mediciones.voltajes.eolica).valor,
                    hora: obtenerUltimo(state.mediciones.voltajes.eolica).tiempo,
                    unidad: 'V'
                },
                {
                    titulo: 'Voltaje Baterias',
                    valor: obtenerUltimo(state.mediciones.voltajes.baterias).valor,
                    hora: obtenerUltimo(state.mediciones.voltajes.baterias).tiempo,
                    unidad: 'V'
                },
                {
                    titulo: 'Corriente Fuente',
                    valor: obtenerUltimo(state.mediciones.corrientes.fuente).valor,
                    hora: obtenerUltimo(state.mediciones.corrientes.fuente).tiempo,
                    unidad: 'A'
                },
                {
                    titulo: 'Corriente Baterias',
                    valor: obtenerUltimo(state.mediciones.corrientes.baterias).valor,
                    hora: obtenerUltimo(state.mediciones.corrientes.baterias).tiempo,
                    unidad: 'A'
                }

            ]
        }

    },//Fin de los getters

    actions: {
        async cargarDatos(){
            this.cargando = true;

            //Cálculo de una hora antes: set-> modifica hora de un objeto Date, get-> trae la hora
            const horaAnterior = new Date();
            horaAnterior.setHours(horaAnterior.getHours() - 1)

            try {

                const respuesta = await fetch(`${this.apiURL}?from=${horaAnterior.toISOString()}`);
                //Verificamos si fue exitosa la respuesta
                if (!respuesta.ok) {
                    throw new Error('Error al obtener los datos');
                }
                //Convertimos la respuesta a json
                const datos = await respuesta.json();
                
                this.procesarDatos(datos);

                this.error = null;

            } catch (error) {
                console.log('Ocurrió un error: ', error);
                this.error = error.message;
            } finally {
                this.cargando = false;
            }
            
        },

        procesarDatos(datos) {
            //suponiendo que el json tendrá una forma parecida al state y los datos podrían ser así:
            //"solar": [{"valor":3.1, "tiempo":"10:00"},{"valor":3.1, "tiempo":"10:00"}...]
            this.mediciones.voltajes.solar = datos.voltmeters.solar.map(item => ({ valor: item.valor, tiempo: item.tiempo }));
            this.mediciones.voltajes.eolica = datos.voltmeters.wind.map(item => ({ valor: item.valor, tiempo: item.tiempo }));
            this.mediciones.voltajes.baterias = datos.voltmeters.baterias.map(item => ({ valor: item.valor, tiempo: item.tiempo }));

            this.mediciones.corrientes.fuente = datos.ammeters.source.map(item => ({ valor: item.valor, tiempo: item.tiempo }));
            this.mediciones.corrientes.baterias = datos.ammeters.batt.map(item => ({ valor: item.valor, tiempo: item.tiempo }));

            this.mediciones.temperaturas.sensor1 = datos.thermometers.therm1.map(item => ({ valor: item.valor, tiempo: item.tiempo }));
            this.mediciones.temperaturas.sensor2 = datos.thermometers.therm2.map(item => ({ valor: item.valor, tiempo: item.tiempo }));
            this.mediciones.temperaturas.sensor3 = datos.thermometers.therm3.map(item => ({ valor: item.valor, tiempo: item.tiempo }));
        }
    }//Fin de actions

})