import { computed, readonly, ref } from "vue";
import { useRouter } from "vue-router";
import { useCookies } from "./useCookies";

const tokenUsuario = ref('')
const estaAutenticado = ref(false)

export function useAutenticacion() {

    const router = useRouter()
    const {establecerCookie, obtenerCookie, eliminarCookie} = useCookies()
    
    const inicializarAuth = () => {
        const tokenGuardado = obtenerCookie('access_token')
        if (tokenGuardado) {
            tokenUsuario.value = tokenGuardado
            estaAutenticado.value = true
        }
    }

    const validarToken = async (token) => {
        const urlbase = 'http://localhost:8080'

        //Promesa con Timeout:
        const fetchConTimeout = (url, options, timeout = 10000) => {
            return Promise.race([
                fetch(url, options),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout: La validación del token tardó demasiado')), timeout)
                })
            ])
        }
        try {

            document.cookie = `access_token=${token}; path=/`
            const respuesta = await fetchConTimeout(`${urlbase}/live/`, {
                method: 'GET',
                credentials: 'include'
            }, 10000)

            console.log('Status de respuesta:', respuesta.status)

            if (!respuesta.ok) {
                const errorText = await respuesta.text()
                console.log('Error del servidor:', errorText)

                if (respuesta.status === 401) {
                    throw new Error('Token inválido o expirado')
                }else if (respuesta.status === 422){
                    throw new Error('Error 422: El servidor no puede procesar el token. Verifica el formato.')
                }
                throw new Error(`Error de validación: ${respuesta.status}`)
            }

            return true

        } catch (error) {
            console.error('Error al validar token:', error)
            throw error
        }
    }

    const ingresarConToken = async (token) => {
        if (!token || token.trim() === '') {
            throw new Error('El token no puede estar vacío')          
        }

        try {
            establecerCookie('access_token', token, {})
            await validarToken(token)
            tokenUsuario.value = token;
            estaAutenticado.value = true;

            router.push('/panel');

        return { exito: true, mensaje: 'Ingreso al sistema exitoso'};

        } catch (error) {
            tokenUsuario.value = ''
            estaAutenticado.value = false
            eliminarCookie('access_token')
            throw error
        }
            
    };

    const cerrarSesion = () => {
        eliminarCookie('access_token')
        tokenUsuario.value = ''
        estaAutenticado.value = false
        router.push('/login')
    }

    const tieneAcceso = computed(() => {
        return estaAutenticado.value && tokenUsuario.value !== ''
    })

    return {
        tokenUsuario: readonly(tokenUsuario),
        estaAutenticado: readonly(estaAutenticado),
        cargandoAuth: ref(false),
        errorAuth: ref(null),
        tieneAcceso,
        ingresarConToken,
        inicializarAuth,
        cerrarSesion,
        validarToken
    }
}