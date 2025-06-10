import { computed, readonly, ref } from "vue";
import { useRouter } from "vue-router";
import { useCookies } from "./useCookies";
import { useApi } from "./useApi";

const tokenUsuario = ref('')
const estaAutenticado = ref(false)

export function useAutenticacion() {

    const router = useRouter()
    const {establecerCookie, obtenerCookie, eliminarCookie} = useCookies()
    const {postApi, cargando: cargandoAPI, error: errorApi} = useApi()
    
    const inicializarAuth = () => {
        const tokenGuardado = obtenerCookie('tokenAcceso')
        if (tokenGuardado) {
            tokenUsuario.value = tokenGuardado
            estaAutenticado.value = true
        }
    }

    const validarToken = async (token) => {
        try {

            const respuesta = await postApi('/auth/token-validation',{token})
            if (respuesta && respuesta.valido) {
                return {valido: true}
            }else{
                return {
                    valido: false,
                    error: respuesta.mensaje || 'Token inválido'
                }
            }
        } catch (error) {
            console.error('Error validando token: ', error)
            if (error.message === 'SESION EXPIRADA') {
                cerrarSesion()
                return {valido: false, error: 'Sesión expirada'}
            }
            return{
                valido: false,
                error: 'Error de conexión con el servidor'
            }
        }
    }

    const ingresarConToken = async (token) => {
        if (!token || token.trim() === '') {
            throw new Error('El token no puede estar vacío')          
        }
        const resultado = await validarToken(token)

        if (resultado.valido) {
            establecerCookie('tokenAcceso', token, {
                expires: 7, //7 días
                secure: false,
                sameSite: 'Strict'
            })

            tokenUsuario.value = token
            estaAutenticado.value = true

            router.push('/panel')

            return {exito: true, mensaje: 'Ingreso al sistema exitoso'}
        }else{
            throw new Error(resultado.error || 'Token inválido')
        }
    }

    const cerrarSesion = () => {
        eliminarCookie('tokenAcceso')
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
        cargandoAuth: readonly(cargandoAPI),
        errorAuth: readonly(errorApi),
        tieneAcceso,
        ingresarConToken,
        inicializarAuth,
        cerrarSesion
    }
}