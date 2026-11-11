/* =========================================================
   app.js - Lógica principal e interfaz.
   ========================================================= */

const PANTALLA_INICIAL = 'inicio';

/**
 * Muestra la pantalla indicada y oculta las demás.
 * Si el identificador no existe, muestra la pantalla principal.
 */
function mostrarPantalla(idPantalla) {
  const pantallas = document.querySelectorAll('.pantalla');
  const existe = document.getElementById(idPantalla)?.classList.contains('pantalla');
  const idDestino = existe ? idPantalla : PANTALLA_INICIAL;

  pantallas.forEach((pantalla) => {
    pantalla.hidden = pantalla.id !== idDestino;
  });

  window.scrollTo(0, 0);
}

/**
 * Lee la pantalla a mostrar desde la dirección (#lugares, #montes...).
 */
function pantallaDesdeDireccion() {
  return window.location.hash.replace('#', '') || PANTALLA_INICIAL;
}

/**
 * Devuelve una copia de la lista ordenada por un campo numérico.
 * Los empates mantienen el orden de la hoja. Los valores vacíos van al final.
 */
function ordenarPor(lista, campo, descendente = false) {
  const valor = (excursion) => excursion[campo] ?? Infinity;
  return [...lista].sort((a, b) => {
    if (valor(a) === Infinity || valor(b) === Infinity) {
      return valor(a) === valor(b) ? 0 : valor(a) === Infinity ? 1 : -1;
    }
    return descendente ? valor(b) - valor(a) : valor(a) - valor(b);
  });
}

/**
 * Excursiones de cada categoría, en el orden en que se muestran.
 */
function excursionesOrdenadas() {
  return {
    montes: ordenarPor(EXCURSIONES.montes, 'dificultad'),               // dificultad 1 → 5
    lugares: ordenarPor(EXCURSIONES.lugares, 'popularidad', true),      // más popular primero
    monumentos: ordenarPor(EXCURSIONES.monumentos, 'numero'),           // MN-01 → MN-47
    bicicleta: EXCURSIONES.bicicleta,                                   // orden de la hoja
    completadas: EXCURSIONES.completadas,                               // orden de la hoja
  };
}

/**
 * Texto que se muestra para cada excursión según su categoría.
 * Monumentos: "MN Nº1 - ENCINA DE ERAUL" (sin número, solo el nombre).
 */
function textoExcursion(categoria, excursion) {
  if (categoria === 'monumentos') {
    const nombre = excursion.nombre.toLocaleUpperCase('es');
    return excursion.numero ? `MN Nº${excursion.numero} - ${nombre}` : nombre;
  }
  return excursion.nombre;
}

/**
 * Crea una lista <ul> con los nombres de las excursiones.
 */
function crearLista(categoria, excursiones) {
  const lista = document.createElement('ul');
  lista.className = 'excursiones';

  excursiones.forEach((excursion) => {
    const elemento = document.createElement('li');
    elemento.className = 'excursiones__elemento';
    elemento.textContent = textoExcursion(categoria, excursion);
    lista.appendChild(elemento);
  });

  return lista;
}

/**
 * Crea un desplegable por cada nivel de dificultad (Montes/paseos).
 * El título de cada desplegable es el nivel tal como aparece en el Excel.
 */
function crearDesplegablesPorNivel(categoria, excursiones) {
  const niveles = new Map(); // dificultad -> { nivel, excursiones }

  excursiones.forEach((excursion) => {
    if (!niveles.has(excursion.dificultad)) {
      niveles.set(excursion.dificultad, { nivel: excursion.nivel, excursiones: [] });
    }
    niveles.get(excursion.dificultad).excursiones.push(excursion);
  });

  const fragmento = document.createDocumentFragment();

  niveles.forEach(({ nivel, excursiones: delNivel }) => {
    const desplegable = document.createElement('details');
    desplegable.className = 'desplegable';

    const titulo = document.createElement('summary');
    titulo.className = 'desplegable__titulo';
    titulo.textContent = nivel;

    desplegable.append(titulo, crearLista(categoria, delNivel));
    fragmento.appendChild(desplegable);
  });

  return fragmento;
}

/**
 * Pinta las excursiones de una categoría en su contenedor.
 */
function pintarLista(contenedor, categoria, excursiones) {
  if (!excursiones || excursiones.length === 0) {
    return; // se mantiene el aviso de lista vacía
  }

  const contenido = categoria === 'montes'
    ? crearDesplegablesPorNivel(categoria, excursiones)
    : crearLista(categoria, excursiones);

  contenedor.replaceChildren(contenido);
}

/**
 * Rellena todas las categorías con sus excursiones.
 */
function pintarCategorias() {
  if (typeof EXCURSIONES === 'undefined') {
    console.error('No se han cargado los datos de excursiones (js/datos.js).');
    return;
  }

  const porCategoria = excursionesOrdenadas();

  document.querySelectorAll('.lista-excursiones[data-categoria]').forEach((contenedor) => {
    const categoria = contenedor.dataset.categoria;
    pintarLista(contenedor, categoria, porCategoria[categoria]);
  });
}

/**
 * Punto de entrada de la aplicación.
 */
function iniciarApp() {
  pintarCategorias();
  mostrarPantalla(pantallaDesdeDireccion());

  // Al pulsar un enlace (o el botón "atrás" del móvil) cambia la dirección.
  window.addEventListener('hashchange', () => {
    mostrarPantalla(pantallaDesdeDireccion());
  });
}

document.addEventListener('DOMContentLoaded', iniciarApp);
