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

  actualizarModoRetos(idDestino);
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
 * Nombres de excursiones con el formato corregido: mayúscula inicial, el resto
 * en minúscula salvo los nombres propios. Solo cambia el texto que se ve: el
 * nombre original del Excel se sigue usando para las casillas guardadas y las
 * correcciones del mapa. Las que ya estaban bien escritas no aparecen aquí.
 */
const NOMBRES_CORREGIDOS = {
  // Montes/paseos
  'Cruz del Monte Gorbea': 'Cruz del monte Gorbea',
  'León Dormido (Pico)': 'León Dormido (pico)',
  'Senda de los Cazadores': 'Senda de los cazadores',
  'Cascada del Barranco de la Garona': 'Cascada del barranco de la Garona',
  'ERROTALDE I': 'Errotalde I',
  'Labetxu - El Valle de Los Colores': 'Labetxu - El Valle de los Colores',
  'Mirador de los Buitres': 'Mirador de los buitres',
  'OJO DE IRUAIZETA': 'Ojo de Iruaizeta',
  'Parking Dólmenes Lesaka': 'Parking dólmenes Lesaka',
  'QUINTO REAL': 'Quinto Real',
  'Sendero de los Robles Milenarios': 'Sendero de los robles milenarios',
  'Sierra tajonar': 'Sierra Tajonar',
  'cueva de Lezestali': 'Cueva de Lezestali',
  'Bosque Animado': 'Bosque animado',
  'Cueva de lezaundi': 'Cueva de Lezaundi',
  'El Cristo Yacente de J. Urdín': 'El Cristo yacente de J. Urdín',
  'Fuerte Carlista de Velate': 'Fuerte carlista de Velate',
  'Roble Milenario de Echagüe': 'Roble milenario de Echagüe',
  'Senda Mitológica': 'Senda mitológica',
  'CABEZON DE ECHAURI': 'Cabezón de Echauri',
  'Nacedero del Río Urederra': 'Nacedero del río Urederra',
  'Hayedo Encantado': 'Hayedo encantado',
  // Lugares y pueblos
  'Monasterio Viejo de San Juan de la Peña': 'Monasterio viejo de San Juan de la Peña',
  'Monasterio Nuevo de San Juan de la Peña': 'Monasterio nuevo de San Juan de la Peña',
  'CARNAVALES DE ITUREN Y ZUBIETA': 'Carnavales de Ituren y Zubieta',
  'Fuente del Vino de las Bodegas Irache': 'Fuente del vino de las bodegas Irache',
  'Mirador del Salto del Nervión': 'Mirador del salto del Nervión',
  'Parque Natural Señorío de Bértiz': 'Parque natural Señorío de Bértiz',
  'Chabola de La Hechicera': 'Chabola de la Hechicera',
  'bera': 'Bera',
  'PARKING RUTA CASCADA AIZPUN': 'Parking ruta cascada Aizpún',
  'RUTAS VERDURAS': 'Rutas verduras',
  'Mirador Embalse de Itoiz': 'Mirador embalse de Itoiz',
  'Ciudad Romana de Cara': 'Ciudad romana de Cara',
  'Estanque Celtibérico de la Barbacana': 'Estanque celtibérico de la Barbacana',
  'Villa Romana de Las Musas de Arellano': 'Villa romana de Las Musas de Arellano',
  'RUTAS SABOREANDO ANDOSILLA': 'Rutas saboreando Andosilla',
  'El Memorial del Alto de Loiti': 'El memorial del Alto de Loiti',
  'Posta Romana de Liédena': 'Posta romana de Liédena',
  'Monumento a la Batalla de Noáin': 'Monumento a la batalla de Noáin',
  'Frontón Público Municipal de Egulbati.': 'Frontón público municipal de Egulbati.',
  // Bicicleta
  'Vía Verde del Plazaola': 'Vía verde del Plazaola',
  'San Esteban de ugarra': 'San Esteban de Ugarra',
};

/**
 * Texto que se muestra para cada excursión según su categoría.
 * Monumentos: "MN Nº1 - Encina de Eraul" (sin número, solo el nombre).
 */
function textoExcursion(categoria, excursion) {
  const nombre = NOMBRES_CORREGIDOS[excursion.nombre] || excursion.nombre;
  if (categoria === 'monumentos') {
    return excursion.numero ? `MN Nº${excursion.numero} - ${nombre}` : nombre;
  }
  return nombre;
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
 * Crea la imagen de un icono (archivo img/iconos/<nombre>.svg).
 * Es decorativa: el texto de al lado ya dice lo que representa.
 */
function crearIcono(nombre, clase) {
  const icono = crearElemento('img', clase);
  icono.src = `img/iconos/${nombre}.svg`;
  icono.alt = '';
  icono.setAttribute('aria-hidden', 'true');
  return icono;
}

/**
 * Icono de cada grupo (desplegable) según la categoría de la web.
 * El valor es el nombre del archivo en img/iconos/ (sin .svg).
 */
const ICONOS_TIPO = {
  'Cascada': 'cascada',
  'Dolmen y megalitos': 'dolmen',
  'Cueva': 'cueva',
  'Pirineo navarro': 'montana-nevada',
  'Pirineo aragonés y francés': 'montana-francia',
  'Cuenca de Pamplona': 'valle',
  'Norte de Navarra': 'abetos',
  'Urbasa, Andía y Aralar': 'oveja',
  'Tierra Estella y Codés': 'amanecer',
  'Zona Media y Prepirineo': 'buitre',
  'Ribera': 'espiga',
  'País Vasco y costa': 'ola',
  'Gran travesía': 'mochila',
};

const ICONOS_CATEGORIA_LUGAR = {
  'Ciudad': 'ciudad',
  'Pueblo': 'pueblo',
  'Iglesia y ermita': 'iglesia',
  'Monasterio': 'monasterio',
  'Castillo y palacio': 'castillo',
  'Ruinas y yacimientos': 'ruinas',
  'Dolmen y megalitos': 'dolmen',
  'Parque y bosque': 'bosque',
  'Naturaleza y paisaje': 'valle',
  'Mirador': 'prismaticos',
  'Cascada': 'cascada',
  'Cueva': 'cueva',
  'Lugar curioso': 'lupa',
  'Gastronomía': 'gastronomia',
  'Ocio': 'noria',
  'Fiesta y tradición': 'campana',
  'Viaje veraniego': 'isla',
};

/**
 * Grupos que no están en las tablas de la hoja Resumen del Excel (y por eso no
 * tienen color allí). Se añaden al final de los desplegables de su categoría.
 * "Viaje veraniego" aparece en la hoja "Completadas por categoría" (Menorca).
 */
const GRUPOS_NUEVOS = {
  lugares: [
    { nombre: 'Viaje veraniego', fondo: '#7FD1C7', letra: '#000000' },
  ],
};

/**
 * Icono de cada tipo de árbol (Monumentos Naturales). Se busca por el
 * comienzo del tipo, así "Roble (grupo)" usa el de "Roble". Los árboles con
 * silueta poco reconocible llevan al lado su fruto, hoja o flor.
 */
const ICONOS_ARBOL = [
  ['Roble', 'roble'],
  ['Quejigo', 'quejigo'],
  ['Encina', 'encina'],
  ['Haya', 'haya'],
  ['Álamo', 'alamo'],
  ['Sauce', 'sauce'],
  ['Arce', 'arce'],
  ['Avellano', 'avellano'],
  ['Nogal', 'nogal'],
  ['Morera', 'morera'],
  ['Peral', 'peral'],
  ['Espino', 'espino'],
  ['Acebo', 'acebo'],
  ['Abeto', 'abeto'],
  ['Pino', 'pino'],
  ['Cedro', 'cedro'],
  ['Secuoya', 'secuoya'],
  ['Tejo', 'tejo'],
  ['Enebro', 'enebro'],
];

function iconoArbol(tipoArbol) {
  const encontrado = ICONOS_ARBOL.find(([tipo]) => (tipoArbol || '').startsWith(tipo));
  return encontrado ? encontrado[1] : 'roble';
}

/**
 * Icono de cada excursión en bici, según su categoría en el Excel.
 */
const ICONOS_BICI = {
  'Vía verde': 'via-verde',
  'Naturaleza': 'pato',
  'Ermita e iglesia': 'iglesia',
  'Lugar curioso': 'lupa',
  'Dolmen y megalitos': 'dolmen',
  'Fortificación': 'castillo',
};

/* ---------- Casillas de "completada" (se guardan en el navegador) ---------- */

// Clave de localStorage de cada categoría (Monumentos conserva la que ya tenía)
const CLAVES_COMPLETADAS = {
  montes: 'montesCompletadas',
  lugares: 'lugaresCompletadas',
  monumentos: 'monumentosVisitados',
  bicicleta: 'bicicletaCompletadas',
};

function idExcursion(excursion) {
  return excursion.numero ? `MN-${excursion.numero}` : excursion.nombre;
}

/**
 * Identificadores de las excursiones marcadas de una categoría. Si todavía no
 * se ha marcado nada en esa categoría, salen marcadas las que el Excel da como
 * completadas (hoja "Completadas por categoría").
 */
function leerCompletadas(categoria) {
  const guardadas = leerDato(CLAVES_COMPLETADAS[categoria], null);
  if (guardadas) {
    return new Set(guardadas);
  }
  return new Set(EXCURSIONES[categoria].filter((e) => e.completada).map(idExcursion));
}

function marcarCompletada(categoria, id, marcada) {
  const completadas = leerCompletadas(categoria);
  if (marcada) {
    completadas.add(id);
  } else {
    completadas.delete(id);
  }
  guardarDato(CLAVES_COMPLETADAS[categoria], [...completadas]);
  actualizarContador();
}

/* ---------- Contador de excursiones realizadas (pantalla principal) ---------- */

/**
 * Número total de casillas marcadas en las 4 categorías.
 */
function contarCompletadas() {
  return Object.keys(CLAVES_COMPLETADAS)
    .reduce((total, categoria) => total + leerCompletadas(categoria).size, 0);
}

function actualizarContador() {
  const total = contarCompletadas();
  document.getElementById('contador-numero').textContent = total;
  document.getElementById('contador-texto').textContent =
    total === 1 ? 'excursión realizada' : 'excursiones realizadas';
}

/**
 * Al pulsar el contador se muestra (o se oculta) la cara enfadada con su mensaje.
 */
function prepararContador() {
  const boton = document.getElementById('contador');
  const aviso = document.getElementById('aviso-contador');
  boton.addEventListener('click', () => {
    aviso.hidden = !aviso.hidden;
    boton.setAttribute('aria-expanded', String(!aviso.hidden));
  });
  actualizarContador();
}

/* ---------- El reloj de Sanfermines (INFORMACIÓN DE INTERÉS) ---------- */

/**
 * Cuenta atrás hasta el chupinazo: 6 de julio a las 12:00 en Pamplona (en julio
 * es hora de verano, UTC+2, es decir, a las 10:00 UTC). Del chupinazo hasta el
 * final del 14 de julio se considera que son fiestas.
 */
function estadoSanfermines(ahora) {
  const anio = new Date(ahora).getUTCFullYear();
  const chupinazo = Date.UTC(anio, 6, 6, 10, 0, 0);
  const finFiestas = Date.UTC(anio, 6, 14, 22, 0, 0); // 15 de julio, 00:00 en Pamplona
  if (ahora < chupinazo) return { enFiestas: false, falta: chupinazo - ahora };
  if (ahora < finFiestas) return { enFiestas: true, falta: 0 };
  return { enFiestas: false, falta: Date.UTC(anio + 1, 6, 6, 10, 0, 0) - ahora };
}

function dosCifras(numero) {
  return String(numero).padStart(2, '0');
}

function actualizarRelojSanfermines() {
  const { enFiestas, falta } = estadoSanfermines(Date.now());
  document.getElementById('reloj-cifras').hidden = enFiestas;
  document.getElementById('reloj-titulo').hidden = enFiestas;
  document.getElementById('reloj-fiesta').hidden = !enFiestas;
  if (enFiestas) return;

  const segundos = Math.floor(falta / 1000);
  document.getElementById('reloj-dias').textContent = Math.floor(segundos / 86400);
  document.getElementById('reloj-horas').textContent = dosCifras(Math.floor(segundos / 3600) % 24);
  document.getElementById('reloj-minutos').textContent = dosCifras(Math.floor(segundos / 60) % 60);
  document.getElementById('reloj-segundos').textContent = dosCifras(segundos % 60);
}

function iniciarRelojSanfermines() {
  actualizarRelojSanfermines();
  setInterval(actualizarRelojSanfermines, 1000);
}

/**
 * Casilla para marcar una excursión como completada. No mueve ni cambia nada:
 * solo guarda la marca para llevar la cuenta.
 */
function crearCasillaCompletada(categoria, excursion, nombreVisible, completadas) {
  const id = idExcursion(excursion);
  const casilla = crearElemento('input', 'casilla-visitado');
  casilla.type = 'checkbox';
  casilla.checked = completadas.has(id);
  casilla.setAttribute('aria-label', `Completada: ${nombreVisible}`);
  casilla.title = 'Marcar como completada';
  casilla.addEventListener('change', () => marcarCompletada(categoria, id, casilla.checked));
  return casilla;
}

/* ---------- Enlace a Google Maps ---------- */

/**
 * Texto de búsqueda en Google Maps a partir de varias partes (las vacías se omiten).
 */
function busquedaMapa(...partes) {
  return partes.filter(Boolean).join(', ');
}

/**
 * Coordenadas (latitud, longitud) de los Monumentos Naturales que Google Maps
 * no encuentra por su nombre o sitúa mal. La clave es el número de monumento.
 * Fuente: anexo del Decreto Foral 87/2009 (BON nº 157, 23/12/2009), UTM huso 30
 * ED50, convertidas a WGS84. En los grupos de árboles, el punto medio del grupo.
 * Los demás monumentos se buscan por su nombre.
 */
const COORDENADAS_MONUMENTOS = {
  7: '42.617112,-2.173813',   // Quejigos de Learza (12 árboles)
  8: '43.002745,-1.797610',   // Roble de Jauntsarats I
  9: '42.997631,-1.798531',   // Roble de Jauntsarats II
  11: '42.019610,-1.557453',  // Roble de El Bocal
  12: '42.928735,-1.283049',  // Roble de Garaioa
  14: '42.993549,-1.276302',  // Haya de Nabala
  16: '43.012532,-1.184653',  // Avellanos de Orion (5 árboles)
  17: '42.420197,-2.077379',  // Álamos de Lodosa (19 árboles)
  18: '42.544427,-1.344663',  // Sauce de la Presa del Molino
  19: '43.011892,-1.184275',  // Arce de Orion
  20: '42.481686,-1.649593',  // Morera del Castillo de Olite
  23: '41.949778,-1.390423',  // Roble de Santa Isabel
  24: '43.119603,-1.899360',  // Abetos de Leitzalarrea (53 árboles)
  27: '43.138991,-1.613955',  // Cedro de Bértiz
  29: '42.933674,-0.924075',  // Pinos de Surio (6 árboles)
  30: '42.839728,-2.084020',  // Tejo de Otsaportillo
  31: '42.998270,-1.094703',  // Tejo de Auztegia
  33: '42.796314,-2.226961',  // Haya de Limitaciones
  34: '42.799182,-2.021396',  // Arce de Lezáun
  37: '43.227542,-1.588947',  // Tejo de Etxalar
  39: '43.303273,-1.631373',  // Acebo de Bera
  40: '43.070101,-1.894959',  // Majuelo de Leitza
  45: '42.900763,-1.937219',  // Robles de Irañeta (5 árboles)
  46: '42.362050,-1.546923',  // Nogal de Mélida
  47: '42.926367,-2.096425',  // Roble de Etxarri-Aranatz
};

/**
 * Correcciones del mapa para excursiones que Google Maps no encuentra bien con
 * "nombre, zona". La clave es el nombre tal cual está en el Excel; el valor es
 * una búsqueda mejor o unas coordenadas (latitud,longitud).
 * Origen de las coordenadas: indicadas por el propietario, o el punto de inicio
 * de la ruta de Wikiloc.
 */
const CORRECCIONES_MAPA = {
  montes: {
    'Odériz': 'Odériz, Navarra',
    'Txargain': '42.861428,-1.878692',                         // inicio de la ruta (Wikiloc)
    'QUINTO REAL': '43.035992,-1.471637',                      // inicio de la ruta (Wikiloc)
    'Abodi. 1532m': 'Monte Abodi, Navarra',
    'Mendaur': 'Monte Mendaur, Navarra',
    'Moncayo': 'Pico del Moncayo',
    'Lapiaz de Andía': '42.843666,-2.012328',                  // inicio en Arbeltz (Wikiloc)
    'Nacedero río Ubagua': 'Riezu, Navarra',
    'Mirador de los Buitres': '42.711894,-1.260414',           // inicio de la ruta (Wikiloc)
    'Balcón de Pilatos': 'Mirador de Ubaba, Urbasa',             // es el de Urbasa (indicado por el propietario)
    'Palacio': '42.739955,-1.367369',                          // indicado por el propietario
    'Torre': '42.759915,-1.410472',                            // indicado por el propietario
    'Ojo de San Prudencio': '42.706266,-2.136910',             // indicado por el propietario
    'Monte de la Cruz / Mirador de buitres': '42.779161,-1.550252', // indicado por el propietario
  },
  lugares: {
    'Tudela': 'Tudela, Navarra',
    'Ochagavía': 'Ochagavía, Navarra',
    'Cirauqui': 'Cirauqui, Navarra',
    'Isaba': 'Isaba, Navarra',
    'Inicio ruta dolmen de Arrako': 'Inicio ruta dolmen de Arrako',
    'Subir aqui en coche': '42.677071,-1.543220',              // indicado por el propietario
    'RUTAS SABOREANDO ANDOSILLA': '42.373623,-1.946973',       // inicio de la ruta (Wikiloc)
    'RUTAS VERDURAS': 'Murchante, Navarra',                    // inicio de la ruta del valle del Queiles
  },
};

/**
 * Dirección de Google Maps que busca un lugar (texto o coordenadas).
 */
function urlMapa(busqueda) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busqueda)}`;
}

/**
 * Recuadro "VER EN EL MAPA" que abre la búsqueda del lugar en Google Maps
 * (en el móvil abre la aplicación de Google Maps si está instalada).
 */
function crearEnlaceMapa(busqueda) {
  const enlace = crearElemento('a', 'ficha__mapa');
  enlace.href = urlMapa(busqueda);
  enlace.target = '_blank';
  enlace.rel = 'noopener noreferrer';
  enlace.setAttribute('aria-label', `Ver en el mapa: ${busqueda} (se abre Google Maps)`);

  const textos = crearElemento('span', 'ficha__mapa-textos');
  textos.append(
    crearElemento('span', 'ficha__mapa-titulo', 'VER EN EL MAPA'),
    crearElemento('span', 'ficha__mapa-detalle', 'Abrir en Google Maps ↗')
  );
  enlace.append(crearIcono('ubicacion', 'ficha__mapa-icono'), textos);
  return enlace;
}

/* ---------- Compartir una excursión ---------- */

// Dirección de la web publicada (se comparte siempre esta, aunque se abra en local)
const URL_WEB = 'https://irozasmate1-source.github.io/excursiones-navarra/';

// Emoji de cada categoría, delante del nombre en el texto compartido
const EMOJI_CATEGORIA = {
  montes: '🥾',
  lugares: '🏘️',
  monumentos: '🌳',
  bicicleta: '🚲',
};

// Emoji de cada dato de la ficha (por su etiqueta)
const EMOJI_DATO = {
  'Coche desde Pamplona': '🚗',
  'Distancia de la ruta': '📏',
  'Desnivel positivo': '⛰️',
  'Tipo de ruta': '🔁',
  'Tipo de recorrido': '🔁',
  'Zona': '📍',
  'Municipio': '📍',
  'Tipo de árbol': '🌳',
  'Especie': '🍃',
  'Km en bici': '🚲',
  'Categoría': '🏷️',
};

// Datos que no se incluyen en el texto compartido
const DATOS_SIN_COMPARTIR = ['Nombre en tu mapa'];

// Nombres completos de las categorías para el texto compartido
const CATEGORIAS_COMPARTIR = {
  montes: 'Montes/paseos',
  lugares: 'Lugares y pueblos',
  monumentos: 'Monumentos Naturales de Navarra',
  bicicleta: 'Bicicleta',
};

/**
 * Línea con la categoría y su grupo: "Montes/paseos · Pirineo navarro".
 */
function lineaCategoria(categoria, excursion) {
  const config = CONFIG_FICHAS[categoria];
  const grupo = config.campoGrupo ? excursion[config.campoGrupo] : null;
  return [CATEGORIAS_COMPARTIR[categoria], grupo].filter(Boolean).join(' · ');
}

/**
 * Línea de dificultad (Montes) o popularidad (Lugares), si la tiene.
 */
function lineaNivel(categoria, excursion) {
  if (categoria === 'montes' && excursion.nivel) {
    return `💪 Dificultad: ${excursion.nivel.replace(/\s*-\s*/, ' · ')}`;
  }
  if (categoria === 'lugares' && excursion.nivelPopularidad) {
    return `⭐ Popularidad: ${excursion.nivelPopularidad.replace(/\s*-\s*/, ' · ')}`;
  }
  return null;
}

/**
 * Texto que se comparte: nombre, extracto de los datos de la ficha,
 * enlace de Google Maps y enlace a la web.
 */
function textoCompartir(categoria, excursion) {
  const config = CONFIG_FICHAS[categoria];
  const lineas = [
    `${EMOJI_CATEGORIA[categoria] || '📌'} *${textoExcursion(categoria, excursion)}*`,
    lineaCategoria(categoria, excursion),
  ];

  const nivel = lineaNivel(categoria, excursion);
  if (nivel) lineas.push(nivel);

  config.datos(excursion).forEach(([, etiqueta, valor]) => {
    if (!valor || DATOS_SIN_COMPARTIR.includes(etiqueta)) return;
    lineas.push(`${EMOJI_DATO[etiqueta] || '•'} ${etiqueta}: ${valor}`);
  });

  // El enlace de la web va primero: WhatsApp hace la vista previa con el
  // primer enlace del mensaje, y así sale la imagen de portada de la web.
  lineas.push('');
  lineas.push(`🌐 Excursiones por Navarra y Compañía: ${URL_WEB}`);
  if (config.mapa) {
    lineas.push(`🗺️ Google Maps: ${urlMapa(config.mapa(excursion))}`);
  }
  if (excursion.wikiloc) {
    lineas.push(`🧭 Ruta en Wikiloc: ${excursion.wikiloc}`);
  }
  return lineas.join('\n');
}

/**
 * Copia un texto al portapapeles. Devuelve true si se ha podido.
 */
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Comparte la excursión con el menú de compartir del dispositivo (WhatsApp,
 * correo...). Si el navegador no lo permite, copia el texto para pegarlo;
 * y si tampoco puede copiarlo, lo muestra para copiarlo a mano.
 */
async function compartirExcursion(categoria, excursion, aviso, cajaTexto) {
  const texto = textoCompartir(categoria, excursion);
  aviso.hidden = true;
  cajaTexto.hidden = true;

  if (navigator.share) {
    try {
      await navigator.share({ title: textoExcursion(categoria, excursion), text: texto });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return; // se cerró el menú sin compartir
    }
  }

  if (await copiarTexto(texto)) {
    aviso.textContent = 'Texto copiado. Pégalo donde quieras compartirlo.';
  } else {
    aviso.textContent = 'Copia este texto para compartirlo:';
    cajaTexto.value = texto;
    cajaTexto.hidden = false;
    cajaTexto.select();
  }
  aviso.hidden = false;
}

/**
 * Recuadro "COMPARTIR" de la ficha, con un aviso debajo para cuando se copia.
 */
function crearBotonCompartir(categoria, excursion) {
  const zona = crearElemento('div', 'ficha__compartir-zona');
  const boton = crearElemento('button', 'ficha__compartir');
  boton.type = 'button';
  boton.setAttribute('aria-label', `Compartir: ${textoExcursion(categoria, excursion)}`);
  boton.append(
    crearIcono('compartir', 'ficha__compartir-icono'),
    crearElemento('span', 'ficha__compartir-titulo', 'COMPARTIR')
  );

  const aviso = crearElemento('p', 'ficha__compartir-aviso');
  aviso.setAttribute('aria-live', 'polite');
  aviso.hidden = true;

  const cajaTexto = crearElemento('textarea', 'ficha__compartir-texto');
  cajaTexto.readOnly = true;
  cajaTexto.rows = 10;
  cajaTexto.setAttribute('aria-label', 'Texto para compartir');
  cajaTexto.hidden = true;

  boton.addEventListener('click', () => compartirExcursion(categoria, excursion, aviso, cajaTexto));
  zona.append(boton, aviso, cajaTexto);
  return zona;
}

/**
 * Configuración de las categorías que se muestran con desplegables y fichas:
 * por qué campo se agrupan, colores e iconos de los grupos, etiqueta junto
 * al nombre, qué datos aparecen en la ficha y qué se busca en el mapa.
 */
const CONFIG_FICHAS = {
  montes: {
    titulo: (e) => textoExcursion('montes', e),
    campoGrupo: 'tipo',
    grupos: () => EXCURSIONES.tiposMontes,
    iconos: ICONOS_TIPO,
    etiqueta: crearEtiquetaDificultad,
    mapa: (e) => CORRECCIONES_MAPA.montes[e.nombre] || busquedaMapa(e.nombre, e.zona),
    marcable: true,
    datos: (e) => [
      ['coche', 'Coche desde Pamplona', formatearMinutos(e.minutosCoche)],
      ['bota', 'Distancia de la ruta', formatearNumero(e.km, 'km')],
      ['desnivel', 'Desnivel positivo', formatearNumero(e.desnivel, 'm')],
      ['ruta', 'Tipo de ruta', e.tipoRuta],
      ['ubicacion', 'Zona', e.zona],
    ],
    bloques: (e) => [
      ['Ruta habitual', e.rutaHabitual],
      ['Notas', e.notas],
    ],
  },
  lugares: {
    titulo: (e) => textoExcursion('lugares', e),
    campoGrupo: 'categoria',
    grupos: () => [...EXCURSIONES.categoriasLugares, ...GRUPOS_NUEVOS.lugares],
    iconos: ICONOS_CATEGORIA_LUGAR,
    etiqueta: crearEtiquetaPopularidad,
    mapa: (e) => CORRECCIONES_MAPA.lugares[e.nombre] || busquedaMapa(e.nombre, e.zona),
    marcable: true,
    datos: (e) => [
      ['coche', 'Coche desde Pamplona', formatearMinutos(e.minutosCoche)],
      ['ubicacion', 'Zona', e.zona],
      ['bota', 'Distancia de la ruta', formatearNumero(e.km, 'km')],
      ['desnivel', 'Desnivel positivo', formatearNumero(e.desnivel, 'm')],
      ['ruta', 'Tipo de ruta', e.tipoRuta],
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
    mapa: (e) => COORDENADAS_MONUMENTOS[e.numero] || busquedaMapa(e.nombre, e.municipio, 'Navarra'),
    datos: (e) => [
      [iconoArbol(e.tipoArbol), 'Tipo de árbol', e.tipoArbol],
      ['hoja', 'Especie', e.especie],
      ['ubicacion', 'Municipio', e.municipio],
      ['coche', 'Coche desde Pamplona', formatearMinutos(e.minutosCoche)],
      ['mapa', 'Nombre en tu mapa', e.nombreMapa !== e.nombre ? e.nombreMapa : null],
    ],
    bloques: (e) => [
      ['Notas', e.notas],
    ],
  },
  // Sin desplegables generales: lista de excursiones en bici con ficha
  bicicleta: {
    titulo: (e) => textoExcursion('bicicleta', e),
    icono: (e) => ICONOS_BICI[e.categoria] || 'bicicleta',
    mapa: (e) => busquedaMapa(e.nombre, e.zona),
    marcable: true,
    datos: (e) => [
      ['coche', 'Coche desde Pamplona', formatearMinutos(e.minutosCoche)],
      ['bicicleta', 'Km en bici', formatearNumero(e.km, 'km')],
      ['ruta', 'Tipo de recorrido', e.tipoRecorrido],
      ['etiqueta', 'Categoría', e.categoria],
      ['ubicacion', 'Zona', e.zona],
    ],
    bloques: (e) => [
      ['Qué es', e.queEs],
      ['Notas', e.notas],
    ],
  },
};

/**
 * Excursiones cuya ficha, al abrirse, muestra solo una foto con un pie
 * (con aspecto de foto antigua en blanco y negro). La clave es el nombre del Excel.
 */
const FICHAS_CON_FOTO = {
  'Menorca': { imagen: 'img/menorca-ciutadella.png', pie: 'Ciutadella 2026' },
};

/**
 * Contenido de una ficha con foto: la imagen y el pie debajo.
 */
function crearContenidoFoto({ imagen, pie }) {
  const contenido = crearElemento('div', 'ficha__contenido ficha__contenido--foto');
  const figura = crearElemento('figure', 'foto-antigua');
  const img = crearElemento('img', 'foto-antigua__imagen');
  img.src = imagen;
  img.alt = pie;
  const marco = crearElemento('div', 'foto-antigua__marco'); // para oscurecer los bordes
  marco.appendChild(img);
  figura.append(marco, crearElemento('figcaption', 'foto-antigua__pie', pie));
  contenido.appendChild(figura);
  return contenido;
}

/**
 * Ficha desplegable de una excursión con todos sus datos.
 */
function crearFicha(config, excursion, categoria) {
  const ficha = crearElemento('details', 'ficha');

  const resumen = crearElemento('summary', 'ficha__resumen');
  const nombre = crearElemento('span', 'ficha__nombre');
  if (config.icono) {
    nombre.appendChild(crearIcono(config.icono(excursion), 'ficha__icono-nombre'));
  }
  nombre.append(config.titulo ? config.titulo(excursion) : excursion.nombre);
  resumen.appendChild(nombre);
  if (config.etiqueta) {
    resumen.appendChild(config.etiqueta(excursion));
  }

  // Excursiones que al abrirse solo muestran una foto con su pie (sin datos)
  const foto = FICHAS_CON_FOTO[excursion.nombre];
  if (foto) {
    ficha.append(resumen, crearContenidoFoto(foto));
    return ficha;
  }

  const contenido = crearElemento('div', 'ficha__contenido');

  // Datos principales en recuadros (solo los que tienen valor)
  const datos = crearElemento('dl', 'ficha__datos');
  config.datos(excursion).forEach(([icono, etiqueta, valor]) => {
    if (!valor) return;
    const dato = crearElemento('div', 'ficha__dato');
    const titulo = crearElemento('dt', 'ficha__etiqueta');
    titulo.append(crearIcono(icono, 'ficha__icono'), etiqueta);
    dato.append(titulo, crearElemento('dd', 'ficha__valor', valor));
    datos.appendChild(dato);
  });
  contenido.appendChild(datos);

  // Recuadro para ver el lugar en Google Maps
  if (config.mapa) {
    contenido.appendChild(crearEnlaceMapa(config.mapa(excursion)));
  }

  // Recuadro para compartir la excursión (texto con sus datos y enlaces)
  contenido.appendChild(crearBotonCompartir(categoria, excursion));

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

// Cada excursión pintada con su categoría y su elemento <li> (lo usa el buscador)
const EXCURSIONES_PINTADAS = [];

/**
 * Crea una lista <ul> con las excursiones.
 * En las categorías con configuración de ficha, cada excursión es una ficha
 * desplegable con sus datos; en el resto, solo el nombre.
 */
function crearLista(categoria, excursiones) {
  const lista = crearElemento('ul', 'excursiones');
  const config = CONFIG_FICHAS[categoria];
  const completadas = config?.marcable ? leerCompletadas(categoria) : null;

  excursiones.forEach((excursion) => {
    const elemento = crearElemento('li', 'excursiones__elemento');
    if (config) {
      elemento.classList.add('excursiones__elemento--ficha');
      if (config.marcable) {
        // La casilla queda fuera de la ficha: se ve sin desplegar y no la abre
        elemento.classList.add('excursiones__elemento--marcable');
        const nombreVisible = config.titulo ? config.titulo(excursion) : excursion.nombre;
        elemento.appendChild(crearCasillaCompletada(categoria, excursion, nombreVisible, completadas));
      }
      elemento.appendChild(crearFicha(config, excursion, categoria));
      EXCURSIONES_PINTADAS.push({ categoria, excursion, elemento });
    } else {
      elemento.textContent = textoExcursion(categoria, excursion);
    }
    lista.appendChild(elemento);
  });

  return lista;
}

/**
 * Flecha pequeña al final de un desplegable grande para cerrarlo sin tener
 * que subir hasta su título. Al cerrar, se deja el título a la vista.
 */
function crearBotonCerrar(desplegable) {
  const boton = crearElemento('button', 'desplegable__cerrar');
  boton.type = 'button';
  boton.setAttribute('aria-label', 'Cerrar desplegable');
  boton.append(crearElemento('span', 'desplegable__cerrar-flecha', '▲'), ' Cerrar');
  boton.addEventListener('click', () => {
    desplegable.open = false;
    desplegable.querySelector('summary').scrollIntoView({ block: 'nearest' });
  });
  return boton;
}

/**
 * Añade la flecha de cerrar a los desplegables de la guía de campo,
 * que están escritos en index.html.
 */
function prepararCierresGuia() {
  document.querySelectorAll('.info-guia details.desplegable').forEach((desplegable) => {
    desplegable.appendChild(crearBotonCerrar(desplegable));
  });
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
      titulo.appendChild(crearIcono(config.iconos[nombre], 'desplegable__icono'));
    }
    titulo.append(nombre);

    desplegable.append(titulo, crearLista(categoria, delGrupo), crearBotonCerrar(desplegable));
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

/* ---------- Carrusel de fotos de cada categoría (en el móvil) ---------- */

/**
 * Añade bajo cada galería unos puntitos que indican qué foto se ve y permiten
 * saltar a otra. El deslizamiento lo hace el CSS; en pantallas grandes las
 * fotos van en fila y los puntitos no se muestran.
 */
function prepararCarrusel(galeria) {
  // cada foto es un <img> suelto o un <figure> con la foto y su rótulo
  const fotos = [...galeria.children];
  if (fotos.length < 2) return;

  const puntos = crearElemento('div', 'galeria__puntos');
  const botones = fotos.map((foto, indice) => {
    const boton = crearElemento('button', 'galeria__punto');
    boton.type = 'button';
    boton.setAttribute('aria-label', `Ver foto ${indice + 1} de ${fotos.length}`);
    boton.addEventListener('click', () => {
      galeria.scrollTo({
        left: foto.offsetLeft - (galeria.clientWidth - foto.clientWidth) / 2,
        behavior: 'smooth',
      });
    });
    puntos.appendChild(boton);
    return boton;
  });
  galeria.after(puntos);

  // Marca el puntito de la foto más centrada
  const marcarActivo = () => {
    const centro = galeria.scrollLeft + galeria.clientWidth / 2;
    let activa = 0;
    fotos.forEach((foto, indice) => {
      const distancia = Math.abs(foto.offsetLeft + foto.clientWidth / 2 - centro);
      const mejor = Math.abs(fotos[activa].offsetLeft + fotos[activa].clientWidth / 2 - centro);
      if (distancia < mejor) activa = indice;
    });
    botones.forEach((boton, indice) => {
      boton.classList.toggle('galeria__punto--activo', indice === activa);
      boton.setAttribute('aria-current', indice === activa ? 'true' : 'false');
    });
  };
  galeria.addEventListener('scroll', marcarActivo, { passive: true });
  marcarActivo();
}

function prepararCarruseles() {
  document.querySelectorAll('.galeria').forEach(prepararCarrusel);
}

/* ---------- LA LISTA: mapa de My Maps a pantalla completa ---------- */

/**
 * El botón "Ver a pantalla completa" solo se muestra si el navegador lo
 * permite (en iPhone, por ejemplo, no). Siempre queda el enlace a Google Maps.
 */
function prepararMapaLista() {
  const contenedor = document.getElementById('mapa-lista');
  const boton = document.getElementById('mapa-pantalla-completa');
  if (!contenedor.requestFullscreen) return;
  boton.hidden = false;
  boton.addEventListener('click', () => {
    contenedor.requestFullscreen().catch(() => {
      boton.hidden = true; // si el navegador lo rechaza, se usa el enlace
    });
  });
}

/* ---------- REGIONES, VALLES Y RÍOS: mapas pulsables de comarcas y de ríos ---------- */

// Las 12 comarcas del mapa, con la letra que las identifica en MAPA_COMARCAS
const COMARCAS = {
  a: { id: 'baztan-bidasoa', nombre: 'Baztan-Bidasoa' },
  b: { id: 'larraun-leitzaldea', nombre: 'Larraun-Leitzaldea' },
  c: { id: 'pamplona', nombre: 'Comarca de Pamplona' },
  d: { id: 'sakana', nombre: 'Sakana' },
  e: { id: 'pirineo', nombre: 'Pirineo' },
  f: { id: 'prepirineo', nombre: 'Prepirineo' },
  g: { id: 'tierra-estella', nombre: 'Tierra Estella' },
  h: { id: 'valdizarbe-novenera', nombre: 'Valdizarbe-Novenera' },
  i: { id: 'sanguesa', nombre: 'Comarca de Sangüesa' },
  j: { id: 'zona-media', nombre: 'Zona Media' },
  k: { id: 'ribera-alta', nombre: 'Ribera Alta' },
  l: { id: 'ribera', nombre: 'Ribera' },
};

/*
 * Qué comarca hay en cada punto del mapa (img/mapa-comarcas.webp, 1943 × 2000 px).
 * La imagen se divide en cuadros de 5 × 5 px; cada fila (separadas por "|") dice
 * qué letra de COMARCAS hay en cada cuadro ("." = fuera de Navarra), comprimida:
 * "12a" son 12 cuadros seguidos de la comarca "a". Se calculó a partir de los colores del mapa.
 */
const MAPA_COMARCAS = {
  ancho: 1943,
  alto: 2000,
  celda: 5,
  filas: '389.|389.|182.2a205.|176.11a202.|174.18a197.|173.19a197.|170.22a197.|169.23a197.|164.28a15.11a171.|159.a2.29a14.13a171.|157.34a14.14a170.|157.34a15.17a166.|156.35a15.18a165.|155.37a14.19a164.|155.37a13.24a7.3a150.|155.37a13.27a3.5a149.|155.38a12.36a148.|155.38a11.38a147.|155.39a10.39a146.|155.46a2.41a145.|155.89a145.|154.2b88a145.|153.4b88a144.|150.8b87a144.|149.11b85a144.|149.12b84a144.|137.b.b7.15b83a144.|129.b7.3b3.19b82a145.|129.b6.4b2.20b82a145.|129.2b6.3b.21b83a144.|129.2b6.25b82a145.|129.3b2.28b82a145.|129.33b82a145.|129.33b82a145.|129.32b83a145.|129.31b84a145.|129.31b84a145.|128.31b85a145.|127.32b84a146.|127.32b82a148.|127.33b80a149.|127.34b79a149.|128.33b79a149.|128.33b79a149.|128.34b78a149.|128.33b79a149.|128.31b81a149.|128.26b85a150.|128.24b86a151.|129.19b90a151.|131.17b90a151.|131.13b94a151.|131.13b93a152.|130.14b93a152.|129.14b94a152.|128.15b93a153.|127.16b92a154.|127.16b92a31.2e121.|126.16b92a25.9e121.|125.17b90a24.11e122.|124.17b91a23.11e123.|123.17b90a25.10e124.|122.18b89a25.10e125.|120.20b87a26.10e126.|117.23b86a26.11e126.|116.24b85a27.10e127.|116.24b85a27.10e127.|115.25b85a28.8e128.|112.28b85a28.8e128.|110.32b84a27.8e128.|107.38b82a25.9e128.|107.40b3ab77a24.9e128.|106.45b77a25.10e126.|106.46b62a4c11a23.14e123.|106.56b4a2b11a4c31a5c11a22.16e121.|106.63b2c5a10c28a6c10a22.17e8.2e110.|106.62b20c26a6c11a21.17e6.6e108.|106.62b20c25a7c10a2e20.18e4.8e107.|105.62b22c20a11c9a7e15.33e105.|104.62b30ca22c6a15e11.34e104.|104.61b54c6a19e7.36e2.2e98.|104.61b54c28e4.41e97.|102.63b55c74e95.|102.63b56c75e93.|102.63b56c75e93.|102.63b57c74e5.2e86.|102.63b58c73e4.4e85.|103.62b57c75e2.10e80.|103.62b57c87e80.|103.61b58c87e80.|103.61b59c87e79.|104.60b59c90e76.|104.59b60c97e2.e66.|103.60b60c102e64.|103.60b60c103e63.|102.61b60c103e63.|101.63b59c104e62.|95.4d66b58c105e61.|90.9d66b58c107e59.|90.10d65b58c109e45.2e10.|89.16d60b59c108e42.7e8.|89.16d60b60c25ef83e11.4e22.11e7.|89.17d11b10d39b59c23e4f85e7.6e20.12e7.|88.22d5b15d37b58c22e6f86e4.12e7.e6.14e6.|88.44d35b58c19e9f130e6.|65.4d18.45d35b58c17e12f130e5.|64.6d16.46d36b57c17e13f130e4.|64.7d5.6d.49d12bd14b2c7b57c16e14f130e4.|64.8d3.58d10b6d9b4c6b56c16e16f129e4.|63.75d2b10d2b2c3b5c6b56c16e17f128e4.|60.91d12c5b56c15e23f123e4.|59.93d11c2b59c15e25f122e3.|59.94d70c16e26f113e3.5e3.|59.95d69c16e27f107e9.4e3.|59.95d68c18e27f105e17.|59.94d68c20e26f104e18.|59.94d68c20e27f102e19.|59.93d70c17e29f101e20.|59.95d70c14e31f98e22.|59.96d69c11e34f97e23.|56.99d69c10e35f97e23.|56.99d69c10e38f95e22.|57.87d2c9d70c8e41f93e22.|58.75d7c3d7c4d71c8e41f93e22.|58.72d90c3f3c7e41f93e22.|58.73d88c8f5e42f93e22.|58.74d87c55f92e23.|58.71d89c57f91e23.|58.70d90c59f3e3f81e25.|59.69d91c65f79e26.|59.68d92c65f78e27.|59.65d95c65f78e27.|59.65d95c67f75e28.|60.64d95c69f71e30.|60.65d95c69f69e31.|60.63d98c68f69e31.|59.63d98c69f69e31.|59.63d98c72f66e31.|58.64d97c74f65e31.|57.65d96c74f67e30.|56.67d95c74f67e30.|55.61dg7d94c74f67e30.|53.53d6g3d3g3dg3d92c75f67e30.|52.54d6g2d13g89c76f67e30.|52.52d24g89c75f67e30.|52.30dg18d27g7c8g73c76f67e30.|52.29d3g16d28g6c10g71c78f64e32.|52.28d4g16d44g70c80f64e31.|52.28d5g15d44g70c80f65e30.|51.g28d7g12d45g71c80f65e29.|50.4g26d8g11d45g72c79f65e29.|50.6g24d9g10d45g72c79f65e29.|51.8gd8g11d10g2dg5d47g72c82f61e30.|51.19g8d15g2d48g73c82f61e30.|51.92g72c82f61e31.|51.92g72c80f63e31.|52.90g73c79f63e32.|52.90g73c79f62e33.|52.88g75c78f56e4.2e34.|53.86g2h74c77f57e40.|53.86g4h70c71f65e40.|52.86g5h68c72f66e40.|49.g.87g6h66c73f66e40.|48.89g7h5c7h54c73f61e45.|42.94g25h50c72f60e46.|41.93g28h49c72f59e47.|41.93g30h45c67f7i58e48.|41.93g31h42c68f8i58e48.|40.94g37h36c67f10i56e49.|40.94g37h38c61f14i55e50.|41.93g38h38c60f14i55e50.|42.92g41h35c59f16i54e50.|42.92g44h31c61f17i2e2i45e53.|42.91g46h30c60f23i43e54.|42.91g50h25c61f25i37e58.|42.91g51h24c60f28i25e68.|42.86g2h2g53h23c60f29i24e68.|43.81gh2g59h10c2j6c63f31i22e69.|43.81g62h9c3j3c3j63f34i12e6i70.|42.82g61h9c9j55f2i7f52i70.|42.82g61h8c11j53f3i6f53i70.|43.81g57h12c16j48f4i3f56i69.|43.3g.77g56h12c18j47f63i69.|44.g3.77g56h10c20j46f63i69.|48.78g55h9c25j43f61i70.|48.78g55h7c29j40f62i70.|18.8g22.78g56h6c31j20f3i15f62i70.|17.11g20.78g56h3c36j18f3i14f63i70.|16.13g14.3g.80g56h2c36j3i14f5i9f67i70.|13.16g11.87g56h37j7i10f7i7f68i70.|12.18g8.90g55h37j8if2i6f7i6f44i4.20i71.|12.18g7.90g55h38j13i4f7i6f44i16.6i73.|12.18g6.91g54h38j24i8f43i95.|11.116g55h37j26i6f43i95.|10.118g53h38j27i3f45i95.|8.120g51h40j75i95.|8.121g50h40j75i95.|7.122g49h41j74i96.|2.2g2.124g47h42j74i96.|2.129g45h43j70i2.2i96.|3.129g43h43j70i101.|3.129g42h44j71i100.|3.16g2.112g41h44j73i98.|4.14g3.112g41h44j75i96.|4.14g6.110g40h44j74i97.|4.13g7.110g40h43j72i100.|4.2g3.8g7.110g40h42j72i101.|10.6g8.111g40h40j71i103.|11.5g9.109g41h40j70i104.|11.4g10.107g42h41j69i105.|11.4g10.106g42h41j69i106.|12.2g11.102g45h41j70i106.|25.101g45h41j71i106.|26.100g45h41j71i106.|26.100g45h41j71i106.|26.100g45h41j71i106.|26.100g45h41j57i3.12i105.|25.101g43h43j57i4.10i106.|24.102g43h43j56i7.4i110.|24.102g34h5j3h52j48i9.i111.|24.102g34h63j44i122.|24.101g35h64j43i122.|24.101g35h68j38i123.|24.101g34h69j38i123.|25.100g34h70j36i124.|25.101g32h71j36i124.|21.106g29h73j36i124.|20.108g27h74j35i125.|19.109g28h73j35i125.|19.110g28h72j36i124.|19.111g28h72j35i124.|19.117g23h71j35i124.|19.117g24h70j37i122.|19.116g25h70j38i121.|21.114g26h69j38i121.|21.113g27h70j37i121.|22.112g28h69j37i121.|23.111g28h69j37i121.|23.111g28h69j36i122.|25.3g2.104g29h68j36i122.|30.104g29h69j34i123.|30.3g.4g3.6g.87g24h2k2h69j34i123.|35.4g4.4g.87g17h11k71j32i123.|35.4g7.g3.86g13h15k71j30i124.|35.4g11.83gkg3k8h19k71j27i126.|50.82g8k5h21k70j24i129.|51.2g2.77g36k68j23i130.|58.73g37k68j22i131.|59.72g37k68j21i132.|59.72g38k67j20i133.|58.73g39k66j19i134.|59.72g40k65j19i134.|63.68g40k65j18i135.|65.66g41k64j17i136.|64.3g2.11g7.44g41k64j17i136.|71.6g10.44g41k63j18i136.|72.5g10.45g40k63j18i136.|86.47g40k63j17i136.|86.48g39k67j12i137.|85.50g39k67j11i137.|86.50g39k67j10i137.|87.48g40k69j8i137.|88.46g41k70j6i138.|90.44g42k70j5i138.|91.43g42k72j2i139.|91.43g42k74j139.|90.43g43k74j139.|92.41g44k74j.2j135.|93.40g44k78j134.|93.12g3.26g43k78j134.|92.12g5.g2.23g42k79j133.|91.10g13.22g39k80j134.|91.9g14.22g37k83j133.|91.9g15.g.20g37k81j134.|91.7g19.21g36k45j2l34j134.|93.3g22.19g38k44j3l32j135.|117.19g40k41j5l30j137.|118.16g41k41j7l27j139.|123.9g43k40j8l27j139.|124.4gkg45k39j11l24j140.|124.3g.47k38j13l22j141.|125.g2.46k38j12l23j142.|128.45k37j14l23j142.|128.45k37j15l21j143.|129.45k34j19l4j3l11j144.|130.45k32j29l9j144.|130.46k29j32l7j145.|129.47k26j37l5j145.|130.46k25j39l3j146.|132.45k23j41lj147.|133.44k22j42l148.|136.k.39k22j42l148.|138.40k2j2l17j43l147.|139.41k5l14j44l146.|139.41k8l10j45l146.|139.41k9l8j46l146.|139.41k10l7j45l147.|138.42k11l5j46l147.|138.44k10l2j48l147.|137.47k57l148.|138.5k.42k55l148.|140.2k3.42k54l148.|146.42k53l148.|147.k2.37k54l148.|150.37k53l149.|149.38k53l149.|149.37k53l150.|150.36k52l151.|153.32k53l151.|154.2k2.27k52l152.|159.25k53l152.|159.2k3.19k54l152.|171.11k55l152.|174.7k56l152.|174.7k56l152.|174.6k58l151.|174.6k59l150.|175.4k61l149.|179.62l148.|179.63l147.|177.65l147.|176.66l147.|176.66l147.|175.67l147.|175.67l147.|175.67l147.|176.66l147.|177.64l148.|178.64l147.|148.3l28.63l147.|147.6l8.7l9.65l147.|146.8l6.9l7.66l147.|145.10l3.12l5.66l148.|145.26l2.68l148.|146.95l148.|145.96l148.|145.96l148.|143.99l147.|142.101l146.|141.104l144.|140.106l143.|140.107l142.|139.109l141.|138.110l141.|137.111l141.|136.112l141.|135.113l141.|134.115l140.|133.117l139.|133.117l139.|132.118l139.|132.119l138.|131.129l129.|131.129l129.|131.129l129.|130.130l129.|131.130l128.|131.130l128.|131.130l128.|131.130l128.|131.130l128.|131.129l129.|131.128l130.|132.125l132.|132.124l133.|136.119l134.|136.118l135.|137.117l135.|138.115l136.|140.113l136.|141.111l137.|141.2l2.106l138.|146.105l138.|146.4l2.98l139.|154.4l4.87l140.|162.87l140.|163.85l141.|164.84l141.|165.83l141.|165.82l142.|166.81l142.|167.80l142.|168.13l.64l143.|170.10l3.l3.58l144.|172.8l9.55l145.|178.l12.53l145.|194.51l144.|195.50l144.|195.49l145.|196.46l147.|196.44l149.|197.43l149.|198.41l150.|199.40l150.|201.17l8.13l150.|203.15l9.11l151.|205.11l16.5l152.|211.4l174.|389.|389.',
};

// Las 25 cuencas del mapa de ríos, con la letra que las identifica en MAPA_RIOS
const CUENCAS = {
  a: { id: 'bidasoa', nombre: 'Río Bidasoa' },
  b: { id: 'urumea', nombre: 'Río Urumea' },
  c: { id: 'leizaran', nombre: 'Río Leizaran' },
  d: { id: 'araxes', nombre: 'Río Araxes' },
  e: { id: 'larraun', nombre: 'Río Larraun' },
  f: { id: 'ulzama', nombre: 'Río Ulzama' },
  g: { id: 'araquil', nombre: 'Río Araquil' },
  h: { id: 'erro', nombre: 'Río Erro' },
  i: { id: 'urrobi', nombre: 'Río Urrobi' },
  j: { id: 'irati', nombre: 'Río Irati' },
  k: { id: 'areta', nombre: 'Río Areta' },
  l: { id: 'salazar', nombre: 'Río Salazar' },
  m: { id: 'esca', nombre: 'Río Esca' },
  n: { id: 'urederra', nombre: 'Río Urederra' },
  o: { id: 'ega', nombre: 'Río Ega' },
  p: { id: 'linares', nombre: 'Río Linares' },
  q: { id: 'odron', nombre: 'Río Odrón' },
  r: { id: 'ebro', nombre: 'Río Ebro' },
  s: { id: 'arga', nombre: 'Río Arga' },
  t: { id: 'elorz', nombre: 'Río Elorz' },
  u: { id: 'zidacos', nombre: 'Río Zidacos' },
  v: { id: 'aragon', nombre: 'Río Aragón' },
  w: { id: 'onsella', nombre: 'Río Onsella' },
  x: { id: 'alhama', nombre: 'Río Alhama' },
  y: { id: 'queiles', nombre: 'Río Queiles' },
};

/*
 * Qué cuenca hay en cada punto del mapa de ríos (img/mapa-rios.png, 800 × 850 px), con el mismo
 * formato que MAPA_COMARCAS. Se calculó separando las zonas de color por las líneas de frontera
 * (los ríos azules se taparon antes con el color de alrededor). Las zonas sin nombre en el mapa
 * (las grises y la marrón del norte) no se pueden pulsar.
 */
const MAPA_RIOS = {
  ancho: 800,
  alto: 850,
  celda: 5,
  filas: '160.|160.|160.|160.|160.|75.a84.|72.7a81.|69.10a81.|66.13a81.|65.14a81.|65.14a81.|65.15a80.|65.18a77.|64.2b17a8.a68.|63.4b16a6.4a67.|58.b2.7b16a5.4a67.|55.b2.10b18a2.6a66.|55.13b26a66.|55.12b32a61.|55.13b31a61.|55.13b30a62.|55.13b30a62.|55.12b31a62.|55.12b30a63.|55.12b30a63.|56.11b30a63.|55.2c10b29a64.|55.2c9b29a65.|54.3c9b28a66.|53.5c6b29a67.|51.7c3b31a68.|51.7c2b32a68.|47.d.d9c33a68.|47.3d10c31a69.|47.6d7c5aea4e3a2f11a3s22.j47.|47.7de2c4ea8e8f3a2f2a5s20.5j45.|46.8d16e15f6s6.h9.9j.2j41.|45.9d15e16f9s2.4h3i3.2i12j40.|45.10d14e16f10s5h8i12j.3j36.|45.10d15e15f10s5h7i18j35.|45.9d16e15f11s4h7i22j31.|46.8d17e14f11s4h6i25j29.|45.5e3d19e12f11s5h6i26j28.|45.27e12f11s5h6i25j3l16.3m7.|41.5g25e14f9s6h6i25j4lm3.2m7.5m7.|40.7g24e14f9s6h6i12j17l19m6.|40.9ge5g15e15f8s6h6i10j20l20m5.|31.g7.19g12e15f8s6h6i10j18l22m5.|30.3g2.27g5eg3e15f6s6h6i12j17l17m10.|29.33g3e4g2e14f7s6h6i12j17l16m11.|29.33g2e6g3s2fs8f7s7h5i12j18l15m12.|29.42g6s7f7s7h4i12j19l14m13.|28.43g6s6f7s7h5i11j19l15m13.|28.43g7s5f7s7h5i10j21l14m13.|28.43g7s5f7s7h6i9j20l15m13.|28.12gn30g5s7f7s7hj4i8j3klk17l14m14.|28.6g10n26g6s7f7s6h3j3i8j5k17l13m15.|28.5g11n11s15g7s5f8s6h2j4i9j6k14l13m16.|29.15n11s15g8s4f9s5h2j5i8j7k13l13m16.|29.15n11s15g11sf9s5h3j4i7j9k11l14m16.|29.15n11s14g22s5h4j3i7j9k11l14m16.|28.17n11s12g23s5h5ji8j9k11l15m15.|27.18n13s10g21s7h14j6k14l14m16.|26.19n16s7g6s3tsts2t6s9h13j5k14l16m15.|26.18n2o28s8t4s3t9h12j5k13l17m15.|25.19n2o28s16t9h11j5k13l16m16.|25.17n3o29s15t10h11j5k13l16m16.|26.16n3o2s3o24s15t10h11j5k13l13m19.|26.16n8o24s17t8h11j5k13l13m19.|26.17n7o23s19t7h11j4k14l11m21.|26.17n7o23s20t6h11j4k15l9m22.|23.4o18n6o23s20t5h10j4k16l8m23.|22.9o3n3o7n7o24s20t3h11j4k16l7m24.|22.11on4o7n6o23s23t12j4k16l5m26.|22.16o9n5o23s22t12j4k16lm30.|22.18o6n5o24s22t10j3k17l2m31.|22.20o4n5o24s6t2u14t10jk14l8m30.|22.29o25s5t6u10t10j16l7m30.|24.28o24s4t9u9t9j15l7m31.|24.28o24s3t12u8t8j16l7m30.|13.3o8.29o23s4t11u4v3t9j11l2v6.3m31.|12.5o5.2q29o21s17u9v9j3l8v40.|11.6o4.6q25o21s18u10v11j8v40.|10.6o4p10q23o21s17u13v7j9v40.|9.5o7p9q23o21s17u15v5j7v42.|8.5o9p9qoq20o21s17u17v2j9v41.|7.6r.8p14q17o20s17u19vj8v42.|7.6r2.4r4p13q18o20s16u27v43.|9.3r3.6r2p13q18o20s16u26v44.|10.2r4.5r3p13q18o18s16u27v44.|16.5r4p13q17o17s16u28v44.|16.6r3p13q17o18s16u21v2.3v45.|16.7r3p13q15o19s16u21v50.|15.9r2p14q14o19s17u19v51.|15.10r2p13q15o19s16u19v51.|16.9r3p13q13o20s16u19v51.|16.9r3p6qr6q13o20s16u19v51.|13.12r3p5q5r3q12o21s16u19vr50.|14.12r3p3q7ro2q11o21s17u17v2r15.w34.|14.13r2p3q6r15o21s17u16v3r14.2w34.|15.13r4q6r15o21s17u16v3r14.3w33.|15.14r4q5r16o20s17u16v2r14.5w32.|18.3r.2r.5r3q6r17o18sv16u15v2r14.6w32.|20.r4.6r2q6r19o15s2v16u15v18.5w31.|27.5rq8r16o14s4v14u17v14.r39.|29.14r14o15s3v13u17v13.2r40.|29.16r13o15s2v13u17v13.2r40.|31.6r.10r11o14s2v13u17v13.2r40.|34.2r4.9r10o14s3v10u18v56.|39.11r6o16s6v8u18v56.|40.10r6o16s7v7u17v57.|41.9r7o14s8v4u20v57.|42.9r6o14s9vu24v55.|42.5r.4r6o12s10vu25v54.|42.3r5.2r7o11s35v55.|42.2r8.r7o10s34v56.|52.2r5o2r9s33v57.|55.o6r8s33v57.|56.7r7s32v58.|57.8r4s27v2r3v59.|57.9r2s23v3rv5rv59.|57.8r26v9r60.|60.4r27v10r59.|60.5r26v10r59.|60.6r20v3r2v9r60.|60.8r19v13r60.|60.2r.6r15v16r60.|64.5r14v17r60.|64.6r14v15r61.|66.r.2r14v15r61.|72.3v24r61.|74.25r61.|74.26r60.|76.25r59.|75.26r59.|75.26r59.|75.11rx14r59.|76.3r8x14r59.|63.3x3.3x3.13x13r59.|63.24x13r60.|63.24x14r59.|62.25x15r58.|61.25x17r57.|60.26x17r57.|59.16x2y7x20r56.|58.14x12y20r56.|58.13x13y24r52.|58.12x14y24r52.|58.11x17y22r52.|58.11x15y24r52.|58.11x14y24r53.|58.11x14y23r54.|60.8x16y22r54.|61.6x17y21r55.|63.3x18y20r56.|66.17y21r56.|70.12y21r57.|71.10y22r57.|72.9y22r57.|74.3y4.21r58.|83.19r58.|83.18r59.|84.16r60.|85.7r3.5r60.|88.3r69.|160.|160.|160.|160.|160.',
};

// Los dos mapas pulsables de REGIONES, VALLES Y RÍOS: qué zonas tiene cada uno y a qué pantallas lleva
const MAPAS_PULSABLES = [
  { imagen: 'mapa-comarcas', lienzo: 'mapa-comarcas-resalte', rotulo: 'mapa-comarcas-nombre', zonas: COMARCAS, datos: MAPA_COMARCAS, prefijo: 'comarca-' },
  { imagen: 'mapa-rios', lienzo: 'mapa-rios-resalte', rotulo: 'mapa-rios-nombre', zonas: CUENCAS, datos: MAPA_RIOS, prefijo: 'rio-' },
];

/** Descomprime una fila: "3a2b" → "aaabb". */
function descomprimirFila(fila) {
  return fila.replace(/(\d+)(\D)/g, (_, veces, letra) => letra.repeat(Number(veces)));
}

/** Filas descomprimidas de un mapa (se calculan la primera vez que hacen falta). */
function filasDelMapa(mapa) {
  if (!mapa.filas) mapa.filas = mapa.datos.filas.split('|').map(descomprimirFila);
  return mapa.filas;
}

/** Devuelve la zona (comarca o cuenca) en el punto (x, y) de la imagen original, o null. */
function zonaEnPunto(mapa, x, y) {
  const fila = filasDelMapa(mapa)[Math.floor(y / mapa.datos.celda)];
  const letra = fila ? fila[Math.floor(x / mapa.datos.celda)] : undefined;
  return mapa.zonas[letra] || null;
}

/** Zona bajo el ratón o el dedo, pasando de la imagen en pantalla a la original. */
function zonaDelEvento(mapa, evento, imagen) {
  const caja = imagen.getBoundingClientRect();
  const x = (evento.clientX - caja.left) * mapa.datos.ancho / caja.width;
  const y = (evento.clientY - caja.top) * mapa.datos.alto / caja.height;
  return zonaEnPunto(mapa, x, y);
}

/**
 * Tramos horizontales de cuadros de una zona: [fila, primera columna, nº de cuadros].
 * Sirven para dibujar el resaltado; se calculan una vez por zona.
 */
function tramosDeZona(mapa, letra) {
  if (!mapa.tramos) mapa.tramos = {};
  if (mapa.tramos[letra]) return mapa.tramos[letra];
  const tramos = [];
  filasDelMapa(mapa).forEach((fila, numeroFila) => {
    let inicio = fila.indexOf(letra);
    while (inicio !== -1) {
      let fin = inicio;
      while (fila[fin] === letra) fin++;
      tramos.push([numeroFila, inicio, fin - inicio]);
      inicio = fila.indexOf(letra, fin);
    }
  });
  mapa.tramos[letra] = tramos;
  return tramos;
}

// Color con el que se ilumina la zona bajo el ratón. Se pinta opaco y la transparencia
// la pone el CSS (opacity del lienzo), para que no salgan rayas donde se tocan los cuadros.
const COLOR_RESALTE_COMARCA = '#ffffff';

/** Ilumina la zona indicada (o ninguna, con null) en el lienzo que hay encima del mapa. */
function resaltarZona(mapa, lienzo, imagen, zona) {
  const densidad = window.devicePixelRatio || 1;
  lienzo.width = Math.round(imagen.clientWidth * densidad);
  lienzo.height = Math.round(imagen.clientHeight * densidad);
  const contexto = lienzo.getContext('2d');
  contexto.clearRect(0, 0, lienzo.width, lienzo.height);
  if (!zona) return;
  const letra = Object.keys(mapa.zonas).find((clave) => mapa.zonas[clave] === zona);
  const escalaX = lienzo.width / mapa.datos.ancho * mapa.datos.celda;
  const escalaY = lienzo.height / mapa.datos.alto * mapa.datos.celda;
  contexto.fillStyle = COLOR_RESALTE_COMARCA;
  tramosDeZona(mapa, letra).forEach(([fila, columna, cuadros]) => {
    // Se redondea hacia fuera para que no queden rayas entre cuadros
    const x = Math.floor(columna * escalaX);
    const y = Math.floor(fila * escalaY);
    contexto.fillRect(x, y, Math.ceil((columna + cuadros) * escalaX) - x, Math.ceil((fila + 1) * escalaY) - y);
  });
}

/** Prepara un mapa pulsable: al pulsar una zona se va a su pantalla; con ratón, se ilumina. */
function prepararMapaPulsable(mapa) {
  const imagen = document.getElementById(mapa.imagen);
  const lienzo = document.getElementById(mapa.lienzo);
  const rotulo = document.getElementById(mapa.rotulo);
  if (!imagen) return;
  const textoInicial = rotulo.textContent;
  let zonaActual = null;

  const marcar = (zona) => {
    if (zona === zonaActual) return;
    zonaActual = zona;
    imagen.classList.toggle('mapa-comarcas__imagen--sobre-comarca', Boolean(zona));
    rotulo.textContent = zona ? zona.nombre : textoInicial;
    resaltarZona(mapa, lienzo, imagen, zona);
  };

  imagen.addEventListener('click', (evento) => {
    const zona = zonaDelEvento(mapa, evento, imagen);
    if (zona) location.hash = `#${mapa.prefijo}${zona.id}`;
  });

  // Con ratón: al pasar por encima, la zona se ilumina, aparece la mano y su nombre debajo
  imagen.addEventListener('mousemove', (evento) => marcar(zonaDelEvento(mapa, evento, imagen)));
  imagen.addEventListener('mouseleave', () => marcar(null));
}

function prepararMapasPulsables() {
  MAPAS_PULSABLES.forEach(prepararMapaPulsable);
}

/* ---------- Buscador de excursiones por nombre (pantalla principal) ---------- */

const NOMBRES_CATEGORIA = {
  montes: 'Montes/paseos',
  lugares: 'Lugares y pueblos',
  monumentos: 'Monumentos',
  bicicleta: 'Bicicleta',
};

const MAXIMO_RESULTADOS = 30;

/**
 * Texto en minúsculas y sin tildes, para comparar ("Ermita" = "ermita", "Andía" = "andia").
 */
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Nombre que se ve en la lista (en Monumentos, "MN Nº1 - Encina de Eraul").
 */
function nombreVisible(categoria, excursion) {
  const config = CONFIG_FICHAS[categoria];
  return config.titulo ? config.titulo(excursion) : excursion.nombre;
}

/**
 * Icono de una excursión: el de su grupo (Montes, Lugares) o el suyo propio.
 */
function iconoExcursion(categoria, excursion) {
  const config = CONFIG_FICHAS[categoria];
  if (config.icono) return config.icono(excursion);
  return config.iconos?.[excursion[config.campoGrupo]] || null;
}

/**
 * Excursiones cuyo nombre contiene todas las palabras buscadas.
 * Solo mira el nombre: no distancias, zonas, notas ni categorías.
 */
function buscarExcursiones(texto) {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return [];
  return EXCURSIONES_PINTADAS.filter(({ categoria, excursion }) => {
    const nombre = normalizar(nombreVisible(categoria, excursion));
    return palabras.every((palabra) => nombre.includes(palabra));
  });
}

/**
 * Lleva a la excursión: abre su categoría, su desplegable y su ficha, y baja hasta ella.
 */
function irAExcursion({ categoria, elemento }) {
  const abrirFicha = () => {
    const desplegable = elemento.closest('details.desplegable');
    if (desplegable) desplegable.open = true;
    elemento.querySelector('details.ficha').open = true;
    elemento.scrollIntoView({ block: 'start' });
    elemento.classList.add('excursiones__elemento--resaltado');
    setTimeout(() => elemento.classList.remove('excursiones__elemento--resaltado'), 2500);
  };
  // Al cambiar la dirección se muestra la categoría (y la página sube arriba);
  // la ficha se abre justo después.
  window.addEventListener('hashchange', abrirFicha, { once: true });
  window.location.hash = categoria;
}

function crearResultado(encontrada) {
  const { categoria, excursion } = encontrada;
  const elemento = crearElemento('li');
  const boton = crearElemento('button', 'resultado');
  boton.type = 'button';
  const icono = iconoExcursion(categoria, excursion);
  if (icono) boton.appendChild(crearIcono(icono, 'resultado__icono'));
  boton.append(
    crearElemento('span', 'resultado__nombre', nombreVisible(categoria, excursion)),
    crearElemento('span', 'resultado__categoria', NOMBRES_CATEGORIA[categoria])
  );
  boton.addEventListener('click', () => irAExcursion(encontrada));
  elemento.appendChild(boton);
  return elemento;
}

function mostrarResultados(texto) {
  const lista = document.getElementById('buscador-resultados');
  const aviso = document.getElementById('buscador-aviso');
  const encontradas = buscarExcursiones(texto);

  lista.replaceChildren(...encontradas.slice(0, MAXIMO_RESULTADOS).map(crearResultado));
  lista.hidden = encontradas.length === 0;

  if (!texto.trim()) {
    aviso.hidden = true;
  } else if (encontradas.length === 0) {
    aviso.textContent = 'No hay ninguna excursión con ese nombre.';
    aviso.hidden = false;
  } else if (encontradas.length > MAXIMO_RESULTADOS) {
    aviso.textContent = `Se muestran ${MAXIMO_RESULTADOS} de ${encontradas.length}. Escribe más para afinar.`;
    aviso.hidden = false;
  } else {
    aviso.textContent = encontradas.length === 1 ? '1 excursión encontrada.' : `${encontradas.length} excursiones encontradas.`;
    aviso.hidden = false;
  }
}

function prepararBuscador() {
  const campo = document.getElementById('buscador-texto');
  campo.addEventListener('input', () => mostrarResultados(campo.value));
}

/* ---------- Buscador de especies (guía de campo de INFORMACIÓN DE INTERÉS) ---------- */

// Grupo de la guía (clase del desplegable) -> nombre de la etiqueta e icono
const GRUPOS_GUIA = {
  arboles: { nombre: 'Árboles', icono: 'roble' },
  mamiferos: { nombre: 'Mamíferos', icono: 'huella' },
  aves: { nombre: 'Aves', icono: 'pajaro' },
  anfibios: { nombre: 'Anfibios', icono: 'rana' },
  reptiles: { nombre: 'Reptiles', icono: 'lagarto' },
  peces: { nombre: 'Peces', icono: 'pez' },
};

/**
 * Lista de todas las fichas de la guía, con su nombre común, su nombre
 * científico y su grupo. Las fichas están escritas en index.html.
 */
function leerEspeciesGuia() {
  const especies = [];
  Object.entries(GRUPOS_GUIA).forEach(([clave, grupo]) => {
    document.querySelectorAll(`.desplegable--${clave} li.especie`).forEach((elemento) => {
      especies.push({
        grupo,
        elemento,
        nombre: elemento.querySelector('.especie__nombre').textContent.trim(),
        cientifico: elemento.querySelector('.especie__cientifico').textContent.trim(),
      });
    });
  });
  return especies;
}

/**
 * Especies cuyo nombre común o científico contiene todas las palabras buscadas.
 */
function buscarEspecies(especies, texto) {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return [];
  return especies.filter(({ nombre, cientifico }) => {
    const nombres = normalizar(`${nombre} ${cientifico}`);
    return palabras.every((palabra) => nombres.includes(palabra));
  });
}

/**
 * Abre el desplegable de la especie, baja hasta su ficha y la resalta.
 * Se vuelve a bajar un par de veces porque, al cargar las fotos de las
 * fichas de encima, la ficha puede moverse un poco.
 */
function irAEspecie({ elemento }) {
  // Abre todos los desplegables que la contienen (en aves hay subcategorías)
  let desplegable = elemento.closest('details.desplegable');
  while (desplegable) {
    desplegable.open = true;
    desplegable = desplegable.parentElement.closest('details.desplegable');
  }
  const bajar = () => elemento.scrollIntoView({ block: 'start' });
  bajar();
  setTimeout(bajar, 400);
  setTimeout(bajar, 1000);
  elemento.classList.remove('especie--resaltada');
  void elemento.offsetWidth; // reinicia la animación si se pulsa dos veces
  elemento.classList.add('especie--resaltada');
  setTimeout(() => elemento.classList.remove('especie--resaltada'), 2500);
}

function crearResultadoEspecie(especie) {
  const elemento = crearElemento('li');
  const boton = crearElemento('button', 'resultado');
  boton.type = 'button';
  boton.appendChild(crearIcono(especie.grupo.icono, 'resultado__icono'));
  const nombres = crearElemento('span', 'resultado__nombre', especie.nombre);
  nombres.appendChild(crearElemento('span', 'resultado__cientifico', especie.cientifico));
  boton.append(nombres, crearElemento('span', 'resultado__categoria', especie.grupo.nombre));
  boton.addEventListener('click', () => irAEspecie(especie));
  elemento.appendChild(boton);
  return elemento;
}

function mostrarResultadosEspecies(especies, texto) {
  const lista = document.getElementById('buscador-especie-resultados');
  const aviso = document.getElementById('buscador-especie-aviso');
  const encontradas = buscarEspecies(especies, texto);

  lista.replaceChildren(...encontradas.slice(0, MAXIMO_RESULTADOS).map(crearResultadoEspecie));
  lista.hidden = encontradas.length === 0;

  if (!texto.trim()) {
    aviso.hidden = true;
  } else if (encontradas.length === 0) {
    aviso.textContent = 'No hay ninguna especie con ese nombre.';
    aviso.hidden = false;
  } else if (encontradas.length > MAXIMO_RESULTADOS) {
    aviso.textContent = `Se muestran ${MAXIMO_RESULTADOS} de ${encontradas.length}. Escribe más para afinar.`;
    aviso.hidden = false;
  } else {
    aviso.textContent = encontradas.length === 1 ? '1 especie encontrada.' : `${encontradas.length} especies encontradas.`;
    aviso.hidden = false;
  }
}

function prepararBuscadorEspecies() {
  const campo = document.getElementById('buscador-especie');
  if (!campo) return;
  const especies = leerEspeciesGuia();
  campo.addEventListener('input', () => mostrarResultadosEspecies(especies, campo.value));
}

/* ---------- Flecha flotante para volver arriba ---------- */

// Cuánto hay que bajar (en píxeles) para que aparezca la flecha
const DISTANCIA_FLECHA_SUBIR = 600;

/**
 * Muestra la flecha solo dentro de una categoría (no en la pantalla
 * principal) y cuando se ha bajado bastante.
 */
function actualizarBotonSubir() {
  const boton = document.getElementById('boton-subir');
  if (!boton) return;
  const enInicio = pantallaDesdeDireccion() === PANTALLA_INICIAL;
  boton.hidden = enInicio || window.scrollY < DISTANCIA_FLECHA_SUBIR;
}

/**
 * Prepara la flecha: al pulsarla sube al principio de la categoría.
 */
function prepararBotonSubir() {
  const boton = document.getElementById('boton-subir');
  if (!boton) return;
  boton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', actualizarBotonSubir, { passive: true });
  window.addEventListener('hashchange', actualizarBotonSubir);
}

/**
 * Punto de entrada de la aplicación.
 */
/* ---------- RETOS EN EL VALLE: fondo oscuro y fuego animado abajo ---------- */

// El fuego se calcula en una rejilla pequeña (cada celda, unos 3 px) y el navegador la amplía suavizada.
const FUEGO_PX_POR_CELDA = 4;
const FUEGO_MAXIMO_CELDAS_ANCHO = 200;   // en pantallas anchas, celdas algo mayores para no ir lento
const FUEGO_CELDAS_ALTO = 72;
const FUEGO_RUIDO_POR_PX = 0.043;        // grosor de las llamas: el mismo en cualquier ancho de pantalla
const FUEGO_PASOS_COLOR = [              // [calor, rojo, verde, azul, opacidad]: rojo oscuro -> naranja -> amarillo
  [0, 70, 5, 0, 0], [0.2, 170, 25, 0, 140], [0.45, 235, 85, 5, 225],
  [0.7, 255, 150, 20, 255], [0.9, 255, 205, 70, 255], [1, 255, 235, 150, 255],
];

const fuego = { lienzo: null, contexto: null, imagen: null, ancho: 0, alto: 0, escalaX: 0, inicio: 0, animacion: null, permutacion: null };

/** Tabla de números al azar para el ruido (se crea una vez). */
function crearPermutacion() {
  const numeros = [...Array(256).keys()];
  for (let i = numeros.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
  }
  return Uint8Array.from({ length: 512 }, (_, i) => numeros[i & 255]);
}

/** Ruido suave en (x, y): valores entre 0 y 1 que cambian poco a poco. */
function ruidoSuave(x, y) {
  const p = fuego.permutacion;
  const xi = Math.floor(x), yi = Math.floor(y);
  const u = (x - xi) * (x - xi) * (3 - 2 * (x - xi));
  const v = (y - yi) * (y - yi) * (3 - 2 * (y - yi));
  const valor = (a, b) => p[(p[a & 255] + b) & 255] / 255;
  const a = valor(xi, yi), b = valor(xi + 1, yi), c = valor(xi, yi + 1), d = valor(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Ruido con varios niveles de detalle (da los bordes rotos de las llamas). */
function ruidoCapas(x, y, capas = 4) {
  let suma = 0, amplitud = 0.5, frecuencia = 1;
  for (let capa = 0; capa < capas; capa++) {
    suma += amplitud * ruidoSuave(x * frecuencia, y * frecuencia);
    frecuencia *= 2;
    amplitud *= 0.5;
  }
  return suma;
}

/** Color [r, g, b, opacidad] para un calor entre 0 y 1. */
function colorFuego(calor) {
  for (let k = 1; k < FUEGO_PASOS_COLOR.length; k++) {
    const [c1, ...desde] = FUEGO_PASOS_COLOR[k - 1];
    const [c2, ...hasta] = FUEGO_PASOS_COLOR[k];
    if (calor <= c2) {
      const f = (calor - c1) / (c2 - c1);
      return desde.map((valor, i) => valor + (hasta[i] - valor) * f);
    }
  }
  return FUEGO_PASOS_COLOR[FUEGO_PASOS_COLOR.length - 1].slice(1);
}

/** Altura de las llamas en cada columna: unas zonas arden más alto que otras y van cambiando. */
function alturaZonaFuego(xRuido, segundos) {
  return 0.55 + 0.6 * ruidoCapas(xRuido * 0.3 + 40, segundos * 0.3, 3);
}

/** Calor de una celda: ruido que sube y se ondula, más fuerte abajo. */
function calorFuego(xRuido, altura, segundos, alturaZona) {
  const ondulacion = ruidoCapas(xRuido * 0.5 + 13, altura * 1.6 - segundos * 0.8, 2) - 0.5;
  const llama = ruidoCapas(xRuido + ondulacion * 2.2 + altura * 0.8, altura * 2.4 - segundos * 2.2);
  const calor = (llama - 0.32) * 2.3 + (1 - altura / alturaZona) * 1.1 - 0.55;
  return Math.max(0, Math.min(1, calor));
}

/** Ajusta la rejilla al tamaño del lienzo en pantalla. */
function ajustarTamanoFuego() {
  const anchoPantalla = fuego.lienzo.clientWidth || window.innerWidth;
  fuego.ancho = Math.min(FUEGO_MAXIMO_CELDAS_ANCHO, Math.max(60, Math.round(anchoPantalla / FUEGO_PX_POR_CELDA)));
  fuego.alto = FUEGO_CELDAS_ALTO;
  fuego.escalaX = (anchoPantalla / fuego.ancho) * FUEGO_RUIDO_POR_PX;
  fuego.lienzo.width = fuego.ancho;
  fuego.lienzo.height = fuego.alto;
  fuego.imagen = fuego.contexto.createImageData(fuego.ancho, fuego.alto);
}

/** Dibuja un fotograma del fuego. */
function dibujarFuego(segundos) {
  const datos = fuego.imagen.data;
  const alturas = Array.from({ length: fuego.ancho }, (_, x) => alturaZonaFuego(x * fuego.escalaX, segundos));
  for (let y = 0; y < fuego.alto; y++) {
    const altura = 1 - y / (fuego.alto - 1);   // 0 abajo, 1 arriba
    for (let x = 0; x < fuego.ancho; x++) {
      const calor = calorFuego(x * fuego.escalaX, altura, segundos, alturas[x]);
      const [r, g, b, opacidad] = colorFuego(calor);
      const i = (y * fuego.ancho + x) * 4;
      datos[i] = r;
      datos[i + 1] = g;
      datos[i + 2] = b;
      datos[i + 3] = calor < 0.05 ? 0 : opacidad;
    }
  }
  fuego.contexto.putImageData(fuego.imagen, 0, 0);
}

/** Bucle de la animación (unos 24 fotogramas por segundo: suficiente para el fuego y gasta menos). */
function animarFuego(ahora) {
  if (!fuego.ultimo || ahora - fuego.ultimo > 42) {
    fuego.ultimo = ahora;
    dibujarFuego((ahora - fuego.inicio) / 1000);
  }
  fuego.animacion = requestAnimationFrame(animarFuego);
}

function encenderFuego() {
  if (!fuego.lienzo || fuego.animacion) return;
  ajustarTamanoFuego();
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sinMovimiento) {
    dibujarFuego(0);   // quien pide menos animaciones ve el fuego quieto
    return;
  }
  fuego.inicio = performance.now();
  fuego.animacion = requestAnimationFrame(animarFuego);
}

function apagarFuego() {
  if (fuego.animacion) cancelAnimationFrame(fuego.animacion);
  fuego.animacion = null;
}

/** Al entrar en #retos: fondo oscuro y fuego; al salir, todo como antes y la animación parada. */
function actualizarModoRetos(idPantalla) {
  const enRetos = idPantalla === 'retos';
  document.body.classList.toggle('modo-retos', enRetos);
  if (enRetos) encenderFuego();
  else apagarFuego();
}

function prepararFuegoRetos() {
  fuego.lienzo = document.getElementById('retos-fuego');
  if (!fuego.lienzo) return;
  fuego.contexto = fuego.lienzo.getContext('2d');
  fuego.permutacion = crearPermutacion();
  window.addEventListener('resize', () => {
    if (document.body.classList.contains('modo-retos')) {
      ajustarTamanoFuego();
      if (!fuego.animacion) dibujarFuego(0);
    }
  });
}

function iniciarApp() {
  prepararFuegoRetos();
  pintarCategorias();
  prepararContador();
  prepararBuscador();
  prepararCarruseles();
  prepararMapaLista();
  prepararMapasPulsables();
  prepararCierresGuia();
  prepararBuscadorEspecies();
  prepararBotonSubir();
  iniciarRelojSanfermines();
  mostrarPantalla(pantallaDesdeDireccion());

  // Al pulsar un enlace (o el botón "atrás" del móvil) cambia la dirección.
  window.addEventListener('hashchange', () => {
    mostrarPantalla(pantallaDesdeDireccion());
  });
}

document.addEventListener('DOMContentLoaded', iniciarApp);
