import { ref } from "vue";
import { useRouter } from "vue-router";

export function useAutenticacion() {

    const router = useRouter();
    const tokenGenerado = ref('');

    const generarToken = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';

        for (let i = 0; i < 8; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        tokenGenerado.value = resultado;
        return resultado;
    };

    const validarToken = (tokenIngresado) => {
        if (tokenIngresado === tokenGenerado.value) {
          // Guardar el estado de autenticación
          localStorage.setItem('estaAutenticado', 'true');
          localStorage.setItem('tokenUsuario', tokenGenerado.value);
          return true;
        }
        return false;
      };
    
    const redirigirAPanel = () => {
        router.push({name: 'panel'});
    };

    return {
        tokenGenerado,
        generarToken,
        validarToken,
        redirigirAPanel
    };
}