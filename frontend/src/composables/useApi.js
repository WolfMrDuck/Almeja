import { ref } from "vue";
import { useCookies } from "./useCookies";

export function useApi() {
    const cargando = ref(false)
    const error = ref(null)
    const urlBase = 'http://localhost:8080'
    const {obtenerCookie} = useCookies()

    const obtenerConfiguracion = () => {
        const token = obtenerCookie('tokenAcceso')
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    }

    // Función para manejar respuestas
    const manejarRespuesta = async (respuesta) => {
        if (!respuesta.ok) {
            if (respuesta.status === 401) {
                throw new Error('SESIÓN EXPIRADA')
            }
            throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
        }
        return await respuesta.json()
    }

    // GET - Obtener datos
    const getApi = async (endpoint, queryParams = {}) => {
        cargando.value = true
        error.value = null

        try {
            let url = `${urlBase}${endpoint}`
            const params = new URLSearchParams(queryParams)
            if (params.toString()) {
                url += `?${params.toString()}`
            }

            const respuesta = await fetch(url, {
                method: 'GET',
                ...obtenerConfiguracion()
            })

            const datos = await manejarRespuesta(respuesta)
            return datos
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            cargando.value = false
        }

    }

    // POST - Crear datos
    const postApi = async (endpoint, datos) => {
        cargando.value = true
        error.value = null
        
        try {
        const respuesta = await fetch(`${urlBase}${endpoint}`, {
            method: 'POST',
            ...obtenerConfiguracion(),
            body: JSON.stringify(datos)
        })
        
        const resultado = await manejarRespuesta(respuesta)
        return resultado
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            cargando.value = false
        }
    }

    return {
        cargando,
        error,
        getApi,
        postApi
    }

}