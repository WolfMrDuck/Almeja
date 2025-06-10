import Cookies from "js-cookie";

export function useCookies() {
    const establecerCookie = (nombre, valor, opciones = {}) => {
        Cookies.set(nombre, valor, opciones)
    }

    const obtenerCookie = (nombre) => {
        return Cookies.get(nombre)
    }

    const eliminarCookie = (nombre) => {
        Cookies.remove(nombre)
    }

    const obtenerTodasLasCookies = () => {
        return Cookies.get()
    }

    return {
        establecerCookie,
        obtenerCookie,
        eliminarCookie,
        obtenerTodasLasCookies
    }
}