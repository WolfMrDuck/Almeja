import { ref } from "vue";
import { useCookies } from "./useCookies";
import { useAutenticacion } from "./useAutenticacion";

export function useApi() {
    const cargando = ref(false)
    const error = ref(null)
    const urlBase = 'http://localhost:8080'
    const {obtenerCookie} = useCookies()
    const {cerrarSesion} = useAutenticacion()

    // Función para manejar respuestas
    const manejarRespuesta = async (respuesta) => {
        if (!respuesta.ok) {
            if (respuesta.status === 401) {
                cerrarSesion();
                throw new Error('Token inválido o expirado')
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
                credentials: 'include'
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

    return {
        cargando,
        error,
        getApi,
    }
}