import { computed, readonly, ref } from "vue";
import { useRouter } from "vue-router";
import { useCookies } from "./useCookies";

const tokenUsuario = ref('')
const estaAutenticado = ref(false)

export function useAutenticacion() {

    const router = useRouter()
    const {establecerCookie, obtenerCookie, eliminarCookie} = useCookies()
    
    const inicializarAuth = () => {
        const tokenGuardado = obtenerCookie('tokenAcceso')
        if (tokenGuardado) {
            tokenUsuario.value = tokenGuardado
            estaAutenticado.value = true
        }
    }

    const ingresarConToken = async (token) => {
        if (!token || token.trim() === '') {
            throw new Error('El token no puede estar vacío')          
        }
        
        establecerCookie('tokenAcceso', token, {
            expires: 7, //7 días
            sameSite: 'Strict'
        })

        tokenUsuario.value = token;
        estaAutenticado.value = true;

        router.push('/panel');

        return { exito: true, mensaje: 'Ingreso al sistema exitoso'};
    };

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
        cargandoAuth: ref(false),
        errorAuth: ref(null),
        tieneAcceso,
        ingresarConToken,
        inicializarAuth,
        cerrarSesion
    }
}