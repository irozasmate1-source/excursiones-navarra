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
 * Crea un elemento HTML con clase y texto opcionales.
 */
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined && texto !== null) elemento.textContent = texto;
  return elemento;
}

/* ---------- Formato de datos ---------- */

function formatearMinutos(minutos) {
  if (minutos === null || minutos === undefined) return null;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto} min`;
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

function formatearNumero(valor, unidad) {
  if (valor === null || valor === undefined) return null;
  return `${valor.toLocaleString('es-ES', { maximumFractionDigits: 2 })} ${unidad}`;
}

/**
 * Etiqueta de dificultad: "3 · Moderada" (a partir del nivel del Excel).
 */
function crearEtiquetaDificultad(excursion) {
  const nombreNivel = (excursion.nivel || '').replace(/^\d+\s*-\s*/, '');
  const etiqueta = crearElemento(
    'span',
    `dificultad dificultad--${excursion.dificultad}`,
    nombreNivel ? `${excursion.dificultad} · ${nombreNivel}` : `${excursion.dificultad}`
  );
  etiqueta.title = `Dificultad: ${excursion.nivel}`;
  return etiqueta;
}

/**
 * Ficha desplegable de una ruta de Montes/paseos con todos sus datos.
 */
function crearFichaRuta(excursion) {
  const ficha = crearElemento('details', 'ficha');

  const resumen = crearElemento('summary', 'ficha__resumen');
  resumen.append(
    crearElemento('span', 'ficha__nombre', excursion.nombre),
    crearEtiquetaDificultad(excursion)
  );

  const contenido = crearElemento('div', 'ficha__contenido');

  // Datos principales en recuadros
  const datos = crearElemento('dl', 'ficha__datos');
  [
    ['🚗', 'Coche desde Pamplona', formatearMinutos(excursion.minutosCoche)],
    ['🥾', 'Distancia de la ruta', formatearNumero(excursion.km, 'km')],
    ['⛰️', 'Desnivel positivo', formatearNumero(excursion.desnivel, 'm')],
    ['🔁', 'Tipo de ruta', excursion.tipoRuta],
    ['📍', 'Zona', excursion.zona],
  ].forEach(([icono, etiqueta, valor]) => {
    if (!valor) return;
    const dato = crearElemento('div', 'ficha__dato');
    const titulo = crearElemento('dt', 'ficha__etiqueta');
    titulo.append(crearElemento('span', 'ficha__icono', icono), etiqueta);
    dato.append(titulo, crearElemento('dd', 'ficha__valor', valor));
    datos.appendChild(dato);
  });
  contenido.appendChild(datos);

  // Bloques de texto
  [
    ['Ruta habitual', excursion.rutaHabitual],
    ['Notas', excursion.notas],
  ].forEach(([titulo, texto]) => {
    if (!texto) return;
    const bloque = crearElemento('section', 'ficha__bloque');
    bloque.append(crearElemento('h3', 'ficha__subtitulo', titulo), crearElemento('p', 'ficha__texto', texto));
    contenido.appendChild(bloque);
  });

  // Enlace a Wikiloc (si lo hay)
  if (excursion.wikiloc) {
    const enlace = crearElemento('a', 'ficha__enlace', 'Ver track en Wikiloc ↗');
    enlace.href = excursion.wikiloc;
    enlace.target = '_blank';
    enlace.rel = 'noopener noreferrer';
    contenido.appendChild(enlace);
  }

  if (excursion.fuenteKm) {
    contenido.appendChild(crearElemento('p', 'ficha__fuente', `Fuente de los km: ${excursion.fuenteKm}`));
  }

  ficha.append(resumen, contenido);
  return ficha;
}

/**
 * Crea una lista <ul> con las excursiones.
 * En Montes/paseos cada excursión es una ficha desplegable con sus datos.
 */
function crearLista(categoria, excursiones) {
  const lista = crearElemento('ul', 'excursiones');

  excursiones.forEach((excursion) => {
    const elemento = crearElemento('li', 'excursiones__elemento');
    if (categoria === 'montes') {
      elemento.classList.add('excursiones__elemento--ficha');
      elemento.appendChild(crearFichaRuta(excursion));
    } else {
      elemento.textContent = textoExcursion(categoria, excursion);
    }
    lista.appendChild(elemento);
  });

  return lista;
}

/**
 * Emoticono de cada tipo de ruta de Montes/paseos.
 */
const ICONOS_TIPO = {
  'Cascada': '💧',
  'Dolmen y megalitos': '🗿',
  'Cueva': '🦇',
  'Pirineo navarro': '🏔️',
  'Pirineo aragonés y francés': '⛰️🇫🇷',
  'Cuenca de Pamplona': '🏞️',
  'Norte de Navarra': '🌲',
  'Urbasa, Andía y Aralar': '🐑',
  'Tierra Estella y Codés': '🌄',
  'Zona Media y Prepirineo': '🦅',
  'Ribera': '🌾',
  'País Vasco y costa': '🌊',
  'Gran travesía': '🎒',
};

/**
 * Crea un desplegable por cada tipo de ruta (Montes/paseos), en el orden
 * y con el color que les da el Excel. Dentro, por dificultad 1 → 5.
 */
function crearDesplegablesPorTipo(categoria, excursiones) {
  const tipos = new Map(); // nombre del tipo -> { fondo, letra, excursiones }

  (EXCURSIONES.tiposMontes || []).forEach(({ nombre, fondo, letra }) => {
    tipos.set(nombre, { fondo, letra, excursiones: [] });
  });

  excursiones.forEach((excursion) => {
    if (!tipos.has(excursion.tipo)) {
      tipos.set(excursion.tipo, { fondo: null, letra: null, excursiones: [] }); // tipo sin color
    }
    tipos.get(excursion.tipo).excursiones.push(excursion);
  });

  const fragmento = document.createDocumentFragment();

  tipos.forEach(({ fondo, letra, excursiones: delTipo }, nombre) => {
    if (delTipo.length === 0) {
      return;
    }

    const desplegable = document.createElement('details');
    desplegable.className = 'desplegable';
    if (fondo) {
      desplegable.style.setProperty('--color-tipo', fondo);
      desplegable.style.setProperty('--color-tipo-letra', letra);
    }

    const titulo = document.createElement('summary');
    titulo.className = 'desplegable__titulo';
    if (ICONOS_TIPO[nombre]) {
      const icono = crearElemento('span', 'desplegable__icono', ICONOS_TIPO[nombre]);
      icono.setAttribute('aria-hidden', 'true');
      titulo.appendChild(icono);
    }
    titulo.append(nombre);

    desplegable.append(titulo, crearLista(categoria, delTipo));
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
    ? crearDesplegablesPorTipo(categoria, excursiones)
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
