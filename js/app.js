/* =========================================================
   app.js - Lógica principal e interfaz.
   ========================================================= */

/**
 * Punto de entrada de la aplicación.
 */
function iniciarApp() {
  const seccionLista = document.getElementById('lista-excursiones');

  if (!seccionLista) {
    console.error('No se encontró la sección de la lista de excursiones.');
    return;
  }
  // De momento se mantiene el aviso de lista vacía.
}

document.addEventListener('DOMContentLoaded', iniciarApp);
