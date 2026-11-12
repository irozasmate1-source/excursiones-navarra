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
 * Recuadro "VER EN EL MAPA" que abre la búsqueda del lugar en Google Maps
 * (en el móvil abre la aplicación de Google Maps si está instalada).
 */
function crearEnlaceMapa(busqueda) {
  const enlace = crearElemento('a', 'ficha__mapa');
  enlace.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busqueda)}`;
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

/**
 * Configuración de las categorías que se muestran con desplegables y fichas:
 * por qué campo se agrupan, colores e iconos de los grupos, etiqueta junto
 * al nombre, qué datos aparecen en la ficha y qué se busca en el mapa.
 */
const CONFIG_FICHAS = {
  montes: {
    campoGrupo: 'tipo',
    grupos: () => EXCURSIONES.tiposMontes,
    iconos: ICONOS_TIPO,
    etiqueta: crearEtiquetaDificultad,
    mapa: (e) => CORRECCIONES_MAPA.montes[e.nombre] || busquedaMapa(e.nombre, e.zona),
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
    campoGrupo: 'categoria',
    grupos: () => EXCURSIONES.categoriasLugares,
    iconos: ICONOS_CATEGORIA_LUGAR,
    etiqueta: crearEtiquetaPopularidad,
    mapa: (e) => CORRECCIONES_MAPA.lugares[e.nombre] || busquedaMapa(e.nombre, e.zona),
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
    icono: (e) => ICONOS_BICI[e.categoria] || 'bicicleta',
    mapa: (e) => busquedaMapa(e.nombre, e.zona),
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
 * Ficha desplegable de una excursión con todos sus datos.
 */
function crearFicha(config, excursion) {
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
      titulo.appendChild(crearIcono(config.iconos[nombre], 'desplegable__icono'));
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
