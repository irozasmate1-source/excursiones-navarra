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
 * Etiqueta de popularidad: "5 · Muy conocido", con el color del Excel.
 */
function crearEtiquetaPopularidad(excursion) {
  const nombreNivel = (excursion.nivelPopularidad || '').replace(/^\d+\s*-\s*/, '');
  const etiqueta = crearElemento(
    'span',
    'popularidad',
    nombreNivel ? `★ ${excursion.popularidad} · ${nombreNivel}` : `★ ${excursion.popularidad}`
  );
  etiqueta.title = `Popularidad: ${excursion.nivelPopularidad}`;

  const color = (EXCURSIONES.popularidades || []).find((p) => p.nivel === excursion.popularidad);
  if (color) {
    etiqueta.style.setProperty('--color-etiqueta', color.fondo);
    etiqueta.style.setProperty('--color-etiqueta-letra', color.letra);
  }
  return etiqueta;
}

/**
 * Emoticonos de cada grupo (desplegable) según la categoría de la web.
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

const ICONOS_CATEGORIA_LUGAR = {
  'Ciudad': '🏙️',
  'Pueblo': '🏘️',
  'Iglesia y ermita': '⛪',
  'Monasterio': '⛪📿',
  'Castillo y palacio': '🏰👑',
  'Ruinas y yacimientos': '🏛️',
  'Dolmen y megalitos': '🗿',
  'Parque y bosque': '🌳',
  'Naturaleza y paisaje': '🏞️',
  'Mirador': '🔭',
  'Cascada': '💧',
  'Cueva': '🦇',
  'Lugar curioso': '🧐',
  'Gastronomía': '🍽️',
  'Ocio': '🎡',
  'Fiesta y tradición': '🎭🔔',
};

/**
 * Emoticono de cada tipo de árbol (Monumentos Naturales). Se busca por el
 * comienzo del tipo, así "Roble (grupo)" usa el de "Roble". Los árboles muy
 * parecidos llevan un segundo emoticono para distinguirlos.
 */
const ICONOS_ARBOL = [
  ['Roble', '🌳'],
  ['Quejigo', '🌳🍂'],
  ['Encina', '🌳🌰'],
  ['Haya', '🌳🍃'],
  ['Álamo', '🌳🤍'],
  ['Sauce', '🌿'],
  ['Arce', '🍁'],
  ['Avellano', '🌰'],
  ['Nogal', '🌰🍃'],
  ['Morera', '🫐'],
  ['Peral', '🍐'],
  ['Espino', '🌸'],
  ['Acebo', '🌿🔴'],
  ['Abeto', '🌲'],
  ['Pino', '🌲🪵'],
  ['Cedro', '🌲🌿'],
  ['Secuoya', '🌲🌲'],
  ['Tejo', '🌲🔴'],
  ['Enebro', '🌲🫐'],
];

function iconoArbol(tipoArbol) {
  const encontrado = ICONOS_ARBOL.find(([tipo]) => (tipoArbol || '').startsWith(tipo));
  return encontrado ? encontrado[1] : '🌳';
}

/**
 * Emoticono de cada excursión en bici, según su categoría en el Excel.
 */
const ICONOS_BICI = {
  'Vía verde': '🚲🛤️',
  'Naturaleza': '🦆',
  'Ermita e iglesia': '⛪',
  'Lugar curioso': '🧐',
  'Dolmen y megalitos': '🗿',
  'Fortificación': '🏰',
};

/* ---------- Casillas de "visitado" (se guardan en el navegador) ---------- */

const CLAVE_VISITADOS = 'monumentosVisitados';

function idExcursion(excursion) {
  return excursion.numero ? `MN-${excursion.numero}` : excursion.nombre;
}

function leerVisitados() {
  return new Set(leerDato(CLAVE_VISITADOS, []));
}

function marcarVisitado(id, visitado) {
  const visitados = leerVisitados();
  if (visitado) {
    visitados.add(id);
  } else {
    visitados.delete(id);
  }
  guardarDato(CLAVE_VISITADOS, [...visitados]);
}

/**
 * Casilla para marcar una excursión como visitada. No mueve ni cambia nada:
 * solo guarda la marca para llevar la cuenta.
 */
function crearCasillaVisitado(excursion, nombreVisible, visitados) {
  const id = idExcursion(excursion);
  const casilla = crearElemento('input', 'casilla-visitado');
  casilla.type = 'checkbox';
  casilla.checked = visitados.has(id);
  casilla.setAttribute('aria-label', `Visitado: ${nombreVisible}`);
  casilla.title = 'Marcar como visitado';
  casilla.addEventListener('change', () => marcarVisitado(id, casilla.checked));
  return casilla;
}

/**
 * Configuración de las categorías que se muestran con desplegables y fichas:
 * por qué campo se agrupan, colores y emoticonos de los grupos, etiqueta junto
 * al nombre y qué datos aparecen en la ficha.
 */
const CONFIG_FICHAS = {
  montes: {
    campoGrupo: 'tipo',
    grupos: () => EXCURSIONES.tiposMontes,
    iconos: ICONOS_TIPO,
    etiqueta: crearEtiquetaDificultad,
    datos: (e) => [
      ['🚗', 'Coche desde Pamplona', formatearMinutos(e.minutosCoche)],
      ['🥾', 'Distancia de la ruta', formatearNumero(e.km, 'km')],
      ['⛰️', 'Desnivel positivo', formatearNumero(e.desnivel, 'm')],
      ['🔁', 'Tipo de ruta', e.tipoRuta],
      ['📍', 'Zona', e.zona],
    ],
    bloques: (e) => [
      ['Ruta habitual', e.rutaHabitual],
      ['Notas', e.notas],
    ],
  },
  lugares: {
    campoGrupo: 'categoria',
    grupos: () => EXCURSIONES.categoriasLugares,
    iconos: ICONOS_CATEGORIA_LUGAR,
    etiqueta: crearEtiquetaPopularidad,
    datos: (e) => [
      ['🚗', 'Coche desde Pamplona', formatearMinutos(e.minutosCoche)],
      ['📍', 'Zona', e.zona],
      ['🥾', 'Distancia de la ruta', formatearNumero(e.km, 'km')],
      ['⛰️', 'Desnivel positivo', formatearNumero(e.desnivel, 'm')],
      ['🔁', 'Tipo de ruta', e.tipoRuta],
    ],
    bloques: (e) => [
      ['Qué es', e.queEs],
      ['Notas', e.notas],
    ],
  },
  // Sin desplegables generales: lista de árboles con ficha y casilla de visitado
  monumentos: {
    titulo: (e) => textoExcursion('monumentos', e),
    icono: (e) => iconoArbol(e.tipoArbol),
    marcable: true,
    datos: (e) => [
      ['🌳', 'Tipo de árbol', e.tipoArbol],
      ['🔬', 'Especie', e.especie],
      ['📍', 'Municipio', e.municipio],
      ['🚗', 'Coche desde Pamplona', formatearMinutos(e.minutosCoche)],
      ['🗺️', 'Nombre en tu mapa', e.nombreMapa !== e.nombre ? e.nombreMapa : null],
    ],
    bloques: (e) => [
      ['Notas', e.notas],
    ],
  },
  // Sin desplegables generales: lista de excursiones en bici con ficha
  bicicleta: {
    icono: (e) => ICONOS_BICI[e.categoria] || '🚲',
    datos: (e) => [
      ['🚗', 'Coche desde Pamplona', formatearMinutos(e.minutosCoche)],
      ['🚲', 'Km en bici', formatearNumero(e.km, 'km')],
      ['🔁', 'Tipo de recorrido', e.tipoRecorrido],
      ['🏷️', 'Categoría', e.categoria],
      ['📍', 'Zona', e.zona],
    ],
    bloques: (e) => [
      ['Qué es', e.queEs],
      ['Notas', e.notas],
    ],
  },
};

/**
 * Ficha desplegable de una excursión con todos sus datos.
 */
function crearFicha(config, excursion) {
  const ficha = crearElemento('details', 'ficha');

  const resumen = crearElemento('summary', 'ficha__resumen');
  const nombre = crearElemento('span', 'ficha__nombre');
  if (config.icono) {
    const icono = crearElemento('span', 'ficha__icono-nombre', config.icono(excursion));
    icono.setAttribute('aria-hidden', 'true');
    nombre.appendChild(icono);
  }
  nombre.append(config.titulo ? config.titulo(excursion) : excursion.nombre);
  resumen.appendChild(nombre);
  if (config.etiqueta) {
    resumen.appendChild(config.etiqueta(excursion));
  }

  const contenido = crearElemento('div', 'ficha__contenido');

  // Datos principales en recuadros (solo los que tienen valor)
  const datos = crearElemento('dl', 'ficha__datos');
  config.datos(excursion).forEach(([icono, etiqueta, valor]) => {
    if (!valor) return;
    const dato = crearElemento('div', 'ficha__dato');
    const titulo = crearElemento('dt', 'ficha__etiqueta');
    titulo.append(crearElemento('span', 'ficha__icono', icono), etiqueta);
    dato.append(titulo, crearElemento('dd', 'ficha__valor', valor));
    datos.appendChild(dato);
  });
  contenido.appendChild(datos);

  // Bloques de texto
  config.bloques(excursion).forEach(([titulo, texto]) => {
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
 * En las categorías con configuración de ficha, cada excursión es una ficha
 * desplegable con sus datos; en el resto, solo el nombre.
 */
function crearLista(categoria, excursiones) {
  const lista = crearElemento('ul', 'excursiones');
  const config = CONFIG_FICHAS[categoria];
  const visitados = config?.marcable ? leerVisitados() : null;

  excursiones.forEach((excursion) => {
    const elemento = crearElemento('li', 'excursiones__elemento');
    if (config) {
      elemento.classList.add('excursiones__elemento--ficha');
      if (config.marcable) {
        // La casilla queda fuera de la ficha: se ve sin desplegar y no la abre
        elemento.classList.add('excursiones__elemento--marcable');
        const nombreVisible = config.titulo ? config.titulo(excursion) : excursion.nombre;
        elemento.appendChild(crearCasillaVisitado(excursion, nombreVisible, visitados));
      }
      elemento.appendChild(crearFicha(config, excursion));
    } else {
      elemento.textContent = textoExcursion(categoria, excursion);
    }
    lista.appendChild(elemento);
  });

  return lista;
}

/**
 * Crea un desplegable por cada grupo (tipo en Montes, categoría en Lugares),
 * en el orden y con el color que les da el Excel. Dentro se mantiene el orden
 * de la categoría (dificultad 1 → 5 o popularidad 5 → 1).
 */
function crearDesplegablesPorGrupo(categoria, excursiones) {
  const config = CONFIG_FICHAS[categoria];
  const grupos = new Map(); // nombre del grupo -> { fondo, letra, excursiones }

  (config.grupos() || []).forEach(({ nombre, fondo, letra }) => {
    grupos.set(nombre, { fondo, letra, excursiones: [] });
  });

  excursiones.forEach((excursion) => {
    const grupo = excursion[config.campoGrupo];
    if (!grupos.has(grupo)) {
      grupos.set(grupo, { fondo: null, letra: null, excursiones: [] }); // grupo sin color
    }
    grupos.get(grupo).excursiones.push(excursion);
  });

  const fragmento = document.createDocumentFragment();

  grupos.forEach(({ fondo, letra, excursiones: delGrupo }, nombre) => {
    if (delGrupo.length === 0) {
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
    if (config.iconos[nombre]) {
      const icono = crearElemento('span', 'desplegable__icono', config.iconos[nombre]);
      icono.setAttribute('aria-hidden', 'true');
      titulo.appendChild(icono);
    }
    titulo.append(nombre);

    desplegable.append(titulo, crearLista(categoria, delGrupo));
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

  const contenido = CONFIG_FICHAS[categoria]?.campoGrupo
    ? crearDesplegablesPorGrupo(categoria, excursiones)
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
