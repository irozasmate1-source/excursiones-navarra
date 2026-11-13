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
  const fotos = [...galeria.querySelectorAll('img')];
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
function iniciarApp() {
  pintarCategorias();
  prepararContador();
  prepararBuscador();
  prepararCarruseles();
  prepararMapaLista();
  prepararCierresGuia();
  prepararBotonSubir();
  iniciarRelojSanfermines();
  mostrarPantalla(pantallaDesdeDireccion());

  // Al pulsar un enlace (o el botón "atrás" del móvil) cambia la dirección.
  window.addEventListener('hashchange', () => {
    mostrarPantalla(pantallaDesdeDireccion());
  });
}

document.addEventListener('DOMContentLoaded', iniciarApp);
