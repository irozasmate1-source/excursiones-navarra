/* =========================================================
   storage.js - Lectura y escritura de datos en localStorage.
   Todo acceso a localStorage debe pasar por estas funciones.
   ========================================================= */

const PREFIJO_CLAVE = 'excursionesNavarra_';

/**
 * Lee un dato guardado. Devuelve valorPorDefecto si no existe o hay error.
 */
function leerDato(clave, valorPorDefecto = null) {
  try {
    const texto = localStorage.getItem(PREFIJO_CLAVE + clave);
    return texto === null ? valorPorDefecto : JSON.parse(texto);
  } catch (error) {
    console.warn('No se pudo leer el dato:', clave, error);
    return valorPorDefecto;
  }
}

/**
 * Guarda un dato. Devuelve true si se guardó correctamente.
 */
function guardarDato(clave, valor) {
  try {
    localStorage.setItem(PREFIJO_CLAVE + clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn('No se pudo guardar el dato:', clave, error);
    return false;
  }
}
