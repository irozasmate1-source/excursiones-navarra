# CLAUDE.md

## Descripción del proyecto

**EXCURSIONES POR NAVARRA Y COMPAÑÍA** es una aplicación web para gestionar excursiones por Navarra.

- La pantalla principal muestra el título **EXCURSIONES POR NAVARRA Y COMPAÑÍA**, un mapa de Navarra con una rosa de los vientos, cuatro botones de categoría y dos accesos aparte: **INFORMACIÓN DE INTERÉS** (antes "Excursiones completadas") y **LA LISTA** (mapa de My Maps).
- Las excursiones vienen de un archivo Excel que aporta el propietario del proyecto. Ese Excel es solo de lectura.
- La web debe abrirse y funcionar tanto en PC (Windows) como en móvil (Android). Está publicada en GitHub Pages: https://irozasmate1-source.github.io/excursiones-navarra/
- Todos los datos del usuario (por ejemplo, qué árboles ha visitado) se guardan en local, en el navegador del dispositivo. No hay servidor ni base de datos remota.

El proyecto avanza por fases. Solo se implementa lo que se pida en cada momento.

## Estado actual (qué hay hecho)

### Pantalla principal (`#inicio`)
- Cabecera con el título, mapa de Navarra sin fondo (`img/mapa-navarra.png`) y rosa de los vientos encima (`img/rosa-vientos.svg`).
- **Contador de excursiones realizadas**, entre el mapa y los botones: botón redondeado "N excursiones realizadas" ("excursión realizada" si es 1). Suma las casillas marcadas de las 4 categorías (incluidas las marcadas de inicio por el Excel) y se actualiza al marcar o desmarcar.
  - Al pulsarlo aparece/desaparece debajo la **cara enfadada** (`img/cara-enfadada.png`, la imagen del propietario tal cual, con el fondo blanco quitado) y el texto **"¡A SUBIR EL NÚMERO!"**. Botón con `aria-expanded`; sin `alert()`.
  - `img/cara-enfadada.svg` es una versión dibujada anterior que ya no se usa; el propietario prefiere conservarla en la carpeta (no está en git).
- **Buscador de excursiones**, debajo del contador: caja "Buscar excursión" que filtra mientras se escribe.
  - Busca **solo en el nombre que se ve** de cada excursión de las 4 categorías (en Monumentos, "MN Nº5 - El Centinela", así que "5" encuentra MN Nº5, 15, 25… y también los montes con 5 en el nombre, como "Abodi. 1532m"). No busca en distancias, zonas, notas ni nombres de categoría: "monasterio" da los lugares que se llaman "Monasterio…", no la categoría Monasterio.
  - Ignora mayúsculas y tildes ("andia" = "Andía"). Con varias palabras, cada resultado debe contenerlas todas.
  - Cada resultado muestra el icono, el nombre y una etiqueta con su categoría. Máximo 30 resultados ("Se muestran 30 de N. Escribe más para afinar."); sin coincidencias: "No hay ninguna excursión con ese nombre."
  - Al pulsar un resultado se va a su categoría, se abre su desplegable y su ficha, se baja hasta ella y se resalta en amarillo unos segundos.
- Cuatro botones: **LUGARES Y PUEBLOS**, **MONTES/PASEOS**, **BICICLETA** y **MONUMENTOS NATURALES DE NAVARRA**.
- **Todos los títulos de sección van en MAYÚSCULAS** (decisión del propietario): los botones de la pantalla principal, los títulos de cada pantalla y los desplegables de INFORMACIÓN DE INTERÉS (incluidos los de la guía de campo). Están escritos así en `index.html`. Los nombres de los grupos que vienen del Excel ("Pirineo navarro", "Ciudad"…) no se han cambiado.
- Dos botones aparte, en marrón claro (`.acceso-completadas`), dentro de `nav.accesos`: **INFORMACIÓN DE INTERÉS** (enlaza a `#completadas`; el identificador se mantiene) y **LA LISTA** (`#lista`).
  - `.accesos` usa la misma rejilla que `.rutas`: en tablet y ordenador quedan **3 filas de 2** (las dos categorías por fila y estos dos en la última), todas del mismo ancho y separación; en el móvil, uno debajo de otro.
- **Icono de la pestaña (favicon)**: rosa de los vientos azul propia, `img/favicon.svg` y su versión PNG de 32 px `img/favicon-32.png` (para navegadores que no aceptan SVG). No se usó la imagen de Dreamstime que propuso el propietario porque tenía marca de agua.

### Pantallas de categoría
- Navegación por `#hash` (`#lugares`, `#montes`, `#bicicleta`, `#monumentos`, `#completadas`, `#lista`). Funciona con doble clic y con el botón "atrás" del móvil.
- Las excursiones completadas ya no tienen sección propia: están en su categoría como una más (ver "Excursiones completadas").
- Todas tienen una flecha (←) para volver a la pantalla principal.
- Galería de imágenes con borde negro y proporción 4:3 encima de la lista. Excepción: en Monumentos, el cartel (`monumentos-1-mapa.png`) va completo, sin recortar, debajo de la lista.
- **En el móvil (< 768 px) la galería es un carrusel deslizable**: fotos en fila (cada una al 85 % del ancho, `--carrusel-ancho-foto`, asomando la siguiente), `scroll-snap` para que cada foto encaje centrada y barra de desplazamiento oculta. Ocupa unos 220 px de alto (antes ~750 px con las fotos apiladas). Debajo, **puntitos** (`.galeria__puntos`, uno por foto) que marcan la foto visible y llevan a ella al pulsarlos. En tablet y escritorio no cambia nada y los puntitos no se muestran.
  - Los puntitos los crea `app.js` (`prepararCarruseles()`); el deslizamiento es solo CSS (`@media (max-width: 767px)`).
  - En una pestaña oculta el navegador no anima el desplazamiento suave ni lanza el evento `scroll`; para probarlo hay que tener la página visible.
- **Monumentos**: galería de tres fotos (encina `monumentos-3-encina.webp` a la izquierda, la foto antigua `monumentos-2-arbol.png` en el centro y el árbol con valla `monumentos-4-arbol.png` a la derecha). Debajo de la galería y encima de la lista, un recuadro de enlace (`.enlace-web`, icono `globo.svg`) a la web de **Javier Colomo** sobre los Monumentos Naturales (`https://www.javiercolomo.com/index_archivos/M%20Nat/Mns.htm`). La clase `.galeria--sola` ya no se usa.

| Categoría (web) | Hoja del Excel | Cómo se muestra |
|---|---|---|
| Montes/paseos | Rutas (120) + bloque 1 de "Completadas por categoría" (10) = 130 | 13 desplegables por **Tipo**, con el color del Excel y un icono. Dentro, rutas de dificultad 1 → 5 con etiqueta de dificultad. Cada ruta abre una **ficha** con coche desde Pamplona, distancia, desnivel, tipo de ruta, zona, ruta habitual, notas, fuente de los km, botón a Wikiloc si lo hay y recuadro **VER EN EL MAPA**. |
| Lugares y pueblos | Lugares a los que ir (113) + bloque 2 (21) = 134 | 16 desplegables por **Categoría**, con el color del Excel y un icono, más el grupo nuevo **Viaje veraniego** al final. Dentro, de más a menos popular, con etiqueta de popularidad (colores del Excel). Cada lugar abre una **ficha** con coche, zona, qué es, notas, datos de ruta, Wikiloc si lo hay y **VER EN EL MAPA**. Excepción: **Menorca** solo muestra una foto (ver "Ficha con foto"). |
| Monumentos Naturales | Árboles singulares (48) + bloque 3 (1, ya incluido) = 48 | Sin desplegables generales. Lista ordenada por número (`MN Nº1 - Encina de Eraul`, el no oficial al final), con un icono según el tipo de árbol. Cada árbol abre una **ficha** con tipo, especie, municipio, coche, nombre en tu mapa (si difiere), notas y **VER EN EL MAPA**. **No se muestra la columna "Estado".** |
| Bicicleta | Bici (11) + bloque 4 (0) = 11 | Sin desplegables generales. Cada excursión lleva un icono según su categoría y abre una **ficha** con coche, km en bici, tipo de recorrido, categoría, zona, qué es, notas, fuente de los km y **VER EN EL MAPA**. |
| INFORMACIÓN DE INTERÉS | — (texto fijo en `index.html`) | Antes "Excursiones completadas". Página informativa, sin excursiones (ver "INFORMACIÓN DE INTERÉS"). |

Todas las excursiones de las 4 categorías tienen **casilla de completada** (ver abajo).

### Formato de los nombres de las excursiones
- En el Excel los nombres no siguen un formato fijo ("bera", "QUINTO REAL", "Cruz del Monte Gorbea"…). En la web se muestran con **mayúscula inicial y el resto en minúscula, salvo los nombres propios** (pueblos, montes, ríos, santos, nombres de lugares concretos).
- Se hace con `NOMBRES_CORREGIDOS` en `app.js` (nombre del Excel → nombre que se ve), solo para los 42 que no cumplían la regla; los demás se muestran tal cual. Lo usa `textoExcursion(...)`, que es el `titulo` de las 4 categorías, así que también lo ven el buscador y las casillas.
- **Solo cambia lo que se ve.** El nombre original del Excel se sigue usando como identificador de las casillas guardadas y en `CORRECCIONES_MAPA`, así que no se pierden marcas.
- Monumentos: `MN NºXX - Nombre` ("MN Nº35 - Roble de Lizarraga"). "MN Nº" va en mayúsculas por ser sigla; el nombre del árbol, como el resto (antes iba todo en mayúsculas).
- Decisiones de criterio aceptadas por el propietario: se tratan como nombre propio "Tierra Rapaz", "Molino del Infierno", "El Valle de los Colores", "Parque de los Desvelados", "Real Fábrica de Armas", "Hotel Continental"; van en minúscula "Bosque animado", "Hayedo encantado", "Senda mitológica"; se recuperó la tilde perdida en mayúsculas en "Cabezón de Echauri" y "Aizpún".
- Si se añaden excursiones al Excel con nombres mal escritos, hay que añadirlas a `NOMBRES_CORREGIDOS`.

### Ayudas para moverse por listas largas
- **Flecha de cerrar al final de los desplegables grandes**: un "▲ Cerrar" pequeño (`.desplegable__cerrar`, `crearBotonCerrar(desplegable)`) al final de los desplegables de grupo de Montes (13) y Lugares (17) y de los 4 de la guía de campo (`prepararCierresGuia()`). Cierra el desplegable y deja su título a la vista. No está en las fichas de cada excursión ni en Webs, Tiempo y el reloj (son cortos).
- **Flecha flotante de subir**: botón redondo "▲" abajo a la derecha (`#boton-subir`, `.subir`). Aparece al bajar más de `DISTANCIA_FLECHA_SUBIR` (600 px) en cualquier sección menos la pantalla principal, y sube suavemente al principio. Funciones `actualizarBotonSubir()` y `prepararBotonSubir()`.

### INFORMACIÓN DE INTERÉS (`#completadas`)
- Texto escrito directamente en `index.html` (no viene del Excel ni lo pinta `app.js`: el recuadro no lleva `data-categoria`).
- De arriba abajo:
  1. **Línea bajo el título** (`hr.linea-titulo`, grosor en `--grosor-linea-titulo`).
  2. **Recuadro punteado** (mismo estilo que el de las excursiones) con la **introducción** a la web, justificada.
  3. **Tres lemas centrados**, uno por línea: «Ad Astra», «Audentes fortuna iuvat» y **sorioneku en signario celtibérico**. Este último es una imagen, `img/sorioneku.svg`, redibujada trazo a trazo desde la imagen del propietario (el signario celtibérico no existe en Unicode). Solo los signos, sin la transcripción.
  4. Línea (`hr.linea-titulo`), **CÓMO USAR LA WEB** (lista numerada de 6 pasos) y otra línea debajo del paso 6.
  5. **Tres desplegables** (`<details class="desplegable">`, mismo formato que los de las excursiones; color en `:root` y aplicado con las clases `.desplegable--webs`, `.desplegable--tiempo` y `.desplegable--reloj`):
     - **Webs interesantes** (azul `#A9CFEA`, icono `globo.svg`): Javier Colomo (Monumentos Naturales), Rutas Navarra / Napar Bideak (buscador), Navarrincón (excursiones para niños), Mis escapadas por Navarra (listado de rutas; sin el `#google_vignette` de la dirección original), Rutas de Paisajes Enogastronómicos (Visit Navarra) y Visit Navarra (web oficial de turismo).
     - **Tiempo: predicción 7 días** (amarillo `#FFE08A`, icono `tiempo.svg`): enlaces a AEMET (Pamplona/Iruña, 7 días) y a Meteo Navarra (Gobierno de Navarra). Son enlaces: mostrar la predicción dentro de la web necesitaría un widget o servicio externo, pendiente de aprobación.
     - **EL RELOJ DE SANFERMINES** (rosa rojizo `#F4A3A3`, icono `reloj-sanfermin.svg`): cuenta atrás en directo (días, horas, minutos, segundos) hasta el **chupinazo, 6 de julio a las 12:00** hora de Pamplona (10:00 UTC, en julio siempre es horario de verano), con aspecto de reloj LED rojo como el de la calle Estafeta. Del chupinazo al final del 14 de julio muestra "¡Estamos en Sanfermines! ¡Gora San Fermín!"; después cuenta hasta el año siguiente. Debajo, enlace a la página del reloj en sanfermin.com.
       - El reloj de sanfermin.com es un reloj físico; su web no ofrece datos ni widget, así que la cuenta se calcula en el navegador (`estadoSanfermines`, `actualizarRelojSanfermines`, cada segundo).
     - Cada enlace es un recuadro `.enlace-web` con título y una línea de descripción, y se abre en otra pestaña.
  6. Línea (`hr.linea-titulo`) y **GUÍA DE CAMPO BÁSICA** (`.info-guia`, título con el mismo formato que CÓMO USAR LA WEB), con cuatro desplegables de fichas de especie: árboles, mamíferos, aves y anfibios (ver "Guía de campo").
- Los textos del propietario llevan pequeñas correcciones ortográficas aceptadas ("a la web", "excursiones", "¡suerte y disfrutad…!", "Wikiloc").

### Guía de campo (en INFORMACIÓN DE INTERÉS)
- Dos desplegables con **fichas de especie** (`ul.guia-especies` > `li.especie`): foto con borde negro (`.especie__foto`, recorte 4:3 con el encuadre algo subido, `object-position: center 25%`, para no cortar cabezas en fotos verticales), nombre común (`.especie__nombre`), nombre científico en cursiva (`.especie__cientifico`) y descripción breve (`.especie__descripcion`): cómo reconocerla y dónde vive en Navarra. En tablet y ordenador, foto a la izquierda (`--foto-especie-ancho`, 15rem) y texto a la derecha; en el móvil, uno debajo de otro.
- **Árboles: las 25 especies más relevantes** (verde `#B6D7A8`, icono `roble.svg`, `.desplegable--arboles`). Orden: haya, pino silvestre, encina, pino laricio, roble (común y albar), pino carrasco, quejigo, abeto blanco, chopo, castaño, sauce blanco, espino albar, cedro del Líbano, secuoya gigante, nogal, serbal de cazadores, plátano de sombra, tilo, abedul, arce mayor, arce menor, acebo, fresno, álamo blanco y ciprés. Si se añaden más, hay que actualizar el número del título.
  - Fotos en `img/arboles/` (JPG reducidos a 640 px de ancho), sacadas de Wikipedia / Wikimedia Commons. **Cada una lleva un `figcaption` con autor, licencia (CC BY, CC BY-SA, CC0 o dominio público) y enlace a su ficha en Commons**: lo exigen las licencias; no quitarlo.
  - Excepción: el **haya** usa una foto del propietario (`img/arboles/haya.webp`), sin pie de autor. `img/arboles/haya.jpg` (hayedo de Irati, Commons) quedó sin usar; el propietario prefiere conservarla (fuera de git).
  - Descargar de Wikimedia: con varias peticiones seguidas devuelve error 429 ("robot policy"); hay que espaciar las descargas (unos 25 s entre fotos). No poner datos personales en el User-Agent.
- **Mamíferos: los 16 más importantes de Navarra** (arena `#E4C9A2`, icono `huella.svg`, `.desplegable--mamiferos`): jabalí, corzo, ciervo, sarrio, zorro rojo, visón europeo, desmán de los Pirineos, oso pardo, nutria, gato montés, tejón, gineta, garduña, ardilla roja, erizo común y castor europeo.
  - Fotos aportadas por el propietario, en `img/mamiferos/` (JPG reducidos o WebP tal cual), sin pie de autor.
- **Aves: las 30 más relevantes de Navarra** (lila `#D9D2E9`, icono `pajaro.svg`, `.desplegable--aves`). Orden: buitre leonado, quebrantahuesos, garza real, cigüeña blanca, águila real, grulla, paloma silvestre (torcaz), petirrojo, carbonero, cisne, halcón peregrino, milano real, cuervo, urraca (las 14 del propietario); alimoche, búho real, lechuza, cernícalo, pico picapinos, martín pescador, abubilla, golondrina, mirlo, gorrión, perdiz roja (añadidas por Claude para llegar a 25); abejaruco, autillo, cuco y grajo (pedidas después; el grajo lleva el refrán «Cuando el grajo vuela bajo, hace un frío del carajo»); y mirlo acuático (la número 30, propuesta por Claude y aceptada).
  - Fotos en `img/aves/` (JPG a 640 px) de **Wikimedia Commons**, cada una con `figcaption` de autor, licencia y enlace. El propietario pidió fotos "de Google"; no se usan porque casi todas tienen derechos de autor y la web es pública.
  - Las fichas se generaron con scripts de la carpeta temporal (`aves-datos.txt` con nombre|nombre visible|científico|alt|descripción, `aves-creditos2.tsv` con los créditos y `aves-html.ps1` que crea el bloque). Si se pierden, se edita el HTML a mano con el mismo formato.
- **Anfibios: los 12 más comunes de Navarra** (verde agua `#A8D8C0`, icono `rana.svg`, `.desplegable--anfibios`): rana común, sapo común, sapo corredor, sapo partero común, salamandra común, tritón palmeado, tritón jaspeado, tritón pirenaico, rana bermeja, rana ágil, ranita de San Antón y sapillo moteado común.
  - Arriba del todo, dentro del desplegable, una **advertencia** en recuadro rojo (`.advertencia`): "⚠ ¡NUNCA SE MANEJA UN ANFIBIO CON LAS MANOS DESNUDAS! ¡NO ES BUENO PARA ELLOS!" (el "LES." final del mensaje del propietario era una errata, confirmado).
  - Fotos aportadas por el propietario, en `img/anfibios/`, sin pie de autor, salvo la del **sapillo moteado**: lleva impreso "© Javier Fuentes" y su ficha tiene el pie "Foto: © Javier Fuentes · javierfuentes.org" con enlace a la galería de anfibios del autor (`http://www.javierfuentes.org/galer%C3%ADa-de-im%C3%A1genes/anfibios/`). En esa galería hay fotos de sapillo moteado del mismo estilo, pero no se encontró la imagen exacta. Citar al autor no equivale a tener permiso: sigue siendo una foto con derechos reservados.
- Las descripciones las redactó Claude; el propietario puede pedir matizarlas.

### LA LISTA (`#lista`): mapa de My Maps
- Sección con la flecha de volver, el título **LA LISTA** y la línea bajo el título (`hr.linea-titulo`).
- Dentro, el mapa de **Google My Maps "La lista"** del propietario, insertado con un `<iframe>` (`https://www.google.com/maps/d/embed?mid=1V7lsMXTH8brW9LNynKAJOCVaSxGChEo&ehbc=2E312F`), a todo el ancho y con alto `--alto-mapa-lista` (70vh). Es interactivo: moverse, zoom y pinchar en los puntos para ver sus descripciones. `loading="lazy"`: solo carga al entrar en la sección.
- **No está vinculado a la web**: no sabe qué excursiones están marcadas y sus puntos no salen del Excel. Es el mapa **en directo**: lo que el propietario cambie en My Maps se ve en la web sin tocar nada (puede tardar unos minutos). Deja de verse si borra el mapa o deja de compartirlo como "cualquier persona con el enlace".
- Debajo:
  - Botón **"⛶ Ver a pantalla completa"** (`prepararMapaLista()`, Fullscreen API sobre el contenedor `#mapa-lista`). Solo aparece si el navegador lo permite (en iPhone no).
  - Recuadro `.enlace-web` **"Abrir LA LISTA en Google Maps"** (`https://www.google.com/maps/d/viewer?mid=1V7lsMXTH8brW9LNynKAJOCVaSxGChEo`), más cómodo en el móvil.
  - Nota: "Pincha en cada punto del mapa para ver su descripción. Necesita conexión a internet."
- Servicio externo (Google) aprobado expresamente por el propietario. My Maps muestra el nombre del mapa y el autor de la cuenta de Google; no se puede quitar desde la web.

### Excursiones completadas
- Vienen **solo** de la hoja **"Completadas por categoría"** del Excel (la hoja antigua "Completadas" ya no se usa). Esa hoja tiene 4 bloques, uno por categoría, cada uno con las mismas columnas que la hoja principal de su categoría.
- Se muestran en su categoría **como una excursión más** (mismo icono, desplegable y ficha). En `datos.js` llevan `completada: true`.
- El Roble de Lizarraga (MN-35) está en "Árboles singulares" y en las completadas: no se repite, solo se marca como completado.
- **Menorca** tiene la categoría "Viaje veraniego", que no existe en la hoja Resumen: se creó como grupo nuevo en `app.js` (`GRUPOS_NUEVOS`), con color turquesa `#7FD1C7` (elegido, no del Excel) e icono `isla.svg`.

### Ficha con foto (Menorca)
- Al abrir Menorca solo se ve la foto `img/menorca-ciutadella.png` con el pie **"Ciutadella 2026"**, sin datos ni mapa. La lista está en `FICHAS_CON_FOTO` de `app.js`.
- Aspecto de foto antigua en blanco y negro hecho con CSS (`.foto-antigua`: filtro gris/sepia, viñeta, marco de papel viejo, letra manuscrita). La imagen original no se modifica (solo se recortó el borde de la captura).

### Iconos
- Las categorías y los datos de las fichas usan **iconos SVG propios** (`img/iconos/*.svg`, 63 archivos; `compartir.svg` es el del botón COMPARTIR; `globo.svg`, `tiempo.svg`, `reloj-sanfermin.svg`, `huella.svg`, `pajaro.svg` y `rana.svg` son de INFORMACIÓN DE INTERÉS y del enlace de Monumentos), dibujados con colores naturales y estilo ilustrado sobrio. **No se usan emoticonos** (se sustituyeron para dar un aspecto más profesional). La estrella ★ de la popularidad es un carácter tipográfico y se mantiene. Excepción: el texto que se envía con COMPARTIR sí lleva emojis (lo pidió el propietario; en WhatsApp se ven bien).
- Los árboles cuya silueta no se distingue bien (arce, avellano, nogal, morera, peral, espino, acebo) llevan al lado su hoja, fruto o flor.
- Tamaños en variables de `:root`: `--icono-grupo`, `--icono-nombre`, `--icono-dato`, `--icono-mapa`.

### Enlace "VER EN EL MAPA" (Google Maps)
- Recuadro en cada ficha de las 4 categorías principales que abre `https://www.google.com/maps/search/?api=1&query=…` en otra pestaña (en el móvil, la app de Google Maps).
- Búsqueda por defecto: **nombre + zona** (Montes, Lugares, Bicicleta) y **nombre + municipio + Navarra** (Monumentos).
- Las excursiones que Google no encuentra bien tienen una corrección en `app.js`:
  - `COORDENADAS_MONUMENTOS` (por número de monumento): coordenadas oficiales del anexo del **Decreto Foral 87/2009** (BON nº 157, 23/12/2009), UTM huso 30 **ED50** convertidas a WGS84 (desplazamiento aproximado −110 m E, −208 m N). En los grupos de árboles, el punto medio. Se usan solo en los 25 monumentos que Google no sitúa bien por nombre; el resto se busca por nombre (así sale la ficha de Google con fotos).
  - `CORRECCIONES_MAPA.montes` y `CORRECCIONES_MAPA.lugares` (por nombre exacto del Excel): una búsqueda mejor o coordenadas. Las coordenadas vienen del propietario (Palacio, Torre, Ojo de San Prudencio, Monte de la Cruz, Subir aqui en coche) o del punto de inicio de la ruta de Wikiloc (Txargain, Quinto Real, Lapiaz de Andía, Mirador de los Buitres de Ugarra, Saboreando Andosilla). "Balcón de Pilatos" de Montes es el de **Urbasa** (Mirador de Ubaba). "RUTAS VERDURAS" es la ruta del valle del Queiles (Paisajes Enogastronómicos), que sale del entorno de Murchante.
- Revisión hecha (nov. 2026): los 292 enlaces se comprobaron en Google Maps. Quedan aproximados, aceptados por el propietario: Peñas de Aya (parque natural), Hotel Continental de Panticosa (Gran Hotel del mismo balneario), Pueblo de Barandiain (museo Barandiaran, Ataun) y Carnavales de Ituren y Zubieta (Ituren).
- Si se añaden excursiones nuevas al Excel, conviene comprobar su enlace del mapa.

### Botón COMPARTIR (en cada ficha)
- Botón **COMPARTIR** debajo de VER EN EL MAPA: recuadro pequeño y fino (borde de 1 px, 44 px de alto, ancho según el texto) con el icono `compartir.svg` y la palabra COMPARTIR, sin descripción (`.ficha__compartir`; el propietario lo pidió así porque el recuadro grande se veía demasiado). Está en todas las fichas de las 4 categorías salvo las de solo foto (Menorca).
- Envía un **texto** con emojis: nombre en negrita de WhatsApp (`*…*`), categoría y grupo, dificultad (💪) o popularidad (⭐) y los datos de la ficha con su emoji (`EMOJI_DATO`). No incluye las notas ni "Nombre en tu mapa". Al final, el enlace de **Google Maps** (el mismo de VER EN EL MAPA, `urlMapa(...)`) y el de la **página principal de la web** (`URL_WEB`, siempre la publicada, aunque se abra en local). El propietario aceptó que el enlace lleve a la portada y no a la excursión.
- Usa el menú de compartir del dispositivo (`navigator.share`: móvil, Chrome/Edge en Windows). Si no existe, copia el texto al portapapeles y avisa debajo; si tampoco puede, muestra el texto en un recuadro (`.ficha__compartir-texto`) para copiarlo a mano. Sin `alert()`.
- Funciones: `textoCompartir(categoria, excursion)`, `lineaCategoria`, `lineaNivel`, `copiarTexto`, `compartirExcursion` y `crearBotonCompartir`. `crearFicha` recibe ahora también la categoría.
- Pendiente de decisión del propietario: añadir una **tarjeta en imagen** con los datos (dibujada con canvas y compartida como archivo).

### Casilla de completada (todas las categorías)
- Cada excursión de Montes, Lugares, Monumentos y Bicicleta tiene una casilla visible sin abrir la ficha. Al marcarla no ocurre nada más: no cambia de categoría ni se mueve. Solo sirve para llevar la cuenta.
- Se guarda en localStorage, una clave por categoría, con un array de identificadores (el nombre del Excel; en Monumentos `MN-1`, `MN-2`…, o el nombre si no tiene número):
  - `excursionesNavarra_montesCompletadas`, `excursionesNavarra_lugaresCompletadas`, `excursionesNavarra_bicicletaCompletadas`.
  - `excursionesNavarra_monumentosVisitados` (Monumentos conserva su clave antigua para no perder lo ya marcado).
- **Valor inicial:** mientras no se haya marcado nada en una categoría, salen marcadas las que el Excel da como completadas (`completada: true`). En cuanto se toca una casilla, se guarda la lista completa de esa categoría y manda lo guardado.

### Publicación (GitHub Pages)
- La web está publicada en **https://irozasmate1-source.github.io/excursiones-navarra/** y se abre en PC y en móvil. Es el enlace que el propietario comparte.
- Es **pública**: entra cualquiera que tenga el enlace. El propietario ha confirmado que no le importa que se vean sus notas.
- Se queda publicada indefinidamente sin hacer nada. Solo deja de funcionar si se borra el repositorio, se pasa a privado o se desactiva Pages.

### Pendiente o no abordado todavía
- Nada pendiente por ahora.

## Tecnologías

- **HTML5, CSS3 y JavaScript** sin frameworks ni herramientas de compilación.
- **localStorage** para guardar los datos del usuario.
- Los datos del Excel **no se leen en el navegador**: se convierten a `js/datos.js` (ver "Flujo de datos del Excel"). Por eso **no se usa SheetJS** ni existe la carpeta `lib/`.
- Diseño **responsive** pensado primero para el móvil (*mobile-first*).
- Fuentes del sistema: Rockwell (títulos) y Palatino (texto), con alternativas. Sin Google Fonts ni internet.
- Sin dependencias de Node ni npm: la web debe poder abrirse haciendo doble clic en `index.html`.

## Estructura de archivos

```
/
├── CLAUDE.md                              # Este documento
├── index.html                             # Página única con todas las pantallas
├── La_Lista_rutas_por_dificultad_1.xlsx   # Base de datos de excursiones (NO MODIFICAR, fuera de git)
├── css/
│   └── styles.css                         # Estilos globales
├── js/
│   ├── datos.js                           # GENERADO desde el Excel: no editar a mano
│   ├── storage.js                         # Lectura y escritura en localStorage
│   ├── excel.js                           # Vacío (reservado; los datos van por datos.js)
│   └── app.js                             # Navegación, listas, desplegables, fichas, casillas y mapas
└── img/
    ├── iconos/*.svg                       # Iconos de categorías, fichas y desplegables (63)
    ├── favicon.svg, favicon-32.png        # Icono de la pestaña (rosa de los vientos)
    ├── cara-enfadada.png                  # Cara del aviso del contador (cara-enfadada.svg: versión antigua sin usar, fuera de git)
    ├── arboles/                           # Fotos de la guía de campo de árboles (25; haya.jpg sin usar, fuera de git)
    ├── mamiferos/                         # Fotos de la guía de campo de mamíferos (16)
    ├── aves/                              # Fotos de la guía de campo de aves (30, Wikimedia Commons)
    ├── anfibios/                          # Fotos de la guía de campo de anfibios (12)
    ├── menorca-ciutadella.png             # Foto de la ficha de Menorca
    ├── sorioneku.svg                      # Lema en signario celtibérico (INFORMACIÓN DE INTERÉS)
    ├── mapa-navarra.png, rosa-vientos.svg # Pantalla principal
    ├── montes-*.{webp,png}                # Galería de Montes/paseos (3)
    ├── lugares-*.{webp,png}               # Galería de Lugares y pueblos (3)
    ├── bicicleta-*.webp                   # Galería de Bicicleta (2)
    └── monumentos-*.{png,webp}            # Cartel y tres fotos de la galería de Monumentos
```

Orden de carga de scripts en `index.html`: `datos.js`, `storage.js`, `excel.js`, `app.js`.

Los archivos nuevos deben seguir esta estructura. Si hace falta otra carpeta o archivo, se avisa antes de crearlo.

## Flujo de datos del Excel

1. Se copia el Excel a una carpeta temporal y se lee esa copia (es un `.xlsx`, o sea, un zip de XML). **El original nunca se abre para escribir.** Se comprueba su huella MD5 antes y después.
2. Un script de PowerShell genera `js/datos.js` con el objeto `EXCURSIONES`:
   - `montes`, `lugares`, `monumentos`, `bicicleta`: las filas de su hoja y, a continuación, las del bloque correspondiente de **"Completadas por categoría"** (con `completada: true`), en el orden de la hoja. `app.js` se encarga de ordenar.
     - Esa hoja tiene varias tablas una debajo de otra; cada bloque se localiza por su título en la columna A ("1. Montes…", "2. Lugares…", "3. Monumentos…", "4. Bici…").
     - Diferencias de columnas: en los bloques, las notas de Lugares se llaman "Notas" (no "Tus notas del mapa") y el enlace de Wikiloc está en la celda "Fuente km". La fila "Ninguna completada todavía" (sin categoría) se ignora.
     - Monumentos: si el Nº MN ya está en "Árboles singulares", no se repite; se marca ese árbol como completado.
   - `completadas`: vacío (`[]`). La hoja antigua "Completadas" ya no se lee.
   - `tiposMontes` y `categoriasLugares`: nombre y colores (fondo y letra) de cada grupo, leídos de las tablas de la hoja **Resumen**, en su orden.
   - `popularidades`: colores de cada nivel de popularidad, también de la hoja Resumen.
   - Los tiempos en coche se convierten de fracción de día a minutos. Los valores `-` o `—` pasan a `null` y no se muestran.
   - Los enlaces de Wikiloc se extraen de los hipervínculos de las celdas "Ver track".
   - Las tablas terminan en el primer salto de fila, porque debajo hay notas y totales.
3. Si el Excel cambia, hay que **regenerar `datos.js`**. La web no se actualiza sola.

> ⚠️ El script generador (`generar-datos.ps1`) está en la carpeta temporal de la sesión de Claude, **no en el proyecto**, y puede perderse. Si se pierde, hay que reescribirlo siguiendo este apartado. Guardarlo en el proyecto requiere aprobación, porque sería un archivo nuevo.

## Organización de `app.js`

- `CONFIG_FICHAS`: configuración por categoría (`montes`, `lugares`, `monumentos`, `bicicleta`).
  - `campoGrupo` y `grupos`: solo si la categoría tiene desplegables generales.
  - `iconos` (por grupo) o `icono` (por excursión).
  - `etiqueta`: la de dificultad o la de popularidad.
  - `titulo`: texto del nombre, por ejemplo el formato MN.
  - `marcable`: si lleva casilla de completada (ahora, las 4 categorías).
  - `mapa`: texto de búsqueda (o coordenadas) para Google Maps.
  - `datos`: los recuadros de la ficha (`[icono, etiqueta, valor]`).
  - `bloques`: los textos de la ficha.
- Las categorías sin configuración muestran solo nombres (ahora no queda ninguna: `#completadas` es INFORMACIÓN DE INTERÉS, con texto fijo en el HTML).
- Iconos: `crearIcono(nombre, clase)` crea un `<img>` decorativo de `img/iconos/<nombre>.svg`. Los mapas de iconos guardan el nombre del archivo sin `.svg`: `ICONOS_TIPO` (Montes), `ICONOS_CATEGORIA_LUGAR` (Lugares), `ICONOS_ARBOL` (Monumentos, buscado por el comienzo del tipo de árbol) e `ICONOS_BICI` (Bicicleta).
- Mapa: `busquedaMapa(...)`, `urlMapa(busqueda)`, `crearEnlaceMapa(busqueda)`, `COORDENADAS_MONUMENTOS` y `CORRECCIONES_MAPA` (ver "Enlace VER EN EL MAPA").
- Completadas: `CLAVES_COMPLETADAS` (clave de localStorage por categoría), `leerCompletadas(categoria)`, `marcarCompletada(...)` y `crearCasillaCompletada(...)`.
- Contador: `contarCompletadas()`, `actualizarContador()` (se llama también desde `marcarCompletada`) y `prepararContador()` (muestra u oculta la cara al pulsar).
- Reloj de Sanfermines: `estadoSanfermines(ahora)`, `actualizarRelojSanfermines()` e `iniciarRelojSanfermines()` (actualiza cada segundo).
- Buscador: `EXCURSIONES_PINTADAS` (cada excursión pintada con su categoría y su `<li>`, lo rellena `crearLista`), `normalizar(texto)` (minúsculas y sin tildes), `nombreVisible(...)`, `iconoExcursion(...)`, `buscarExcursiones(texto)`, `mostrarResultados(texto)`, `irAExcursion(...)` (cambia el `#hash` y, tras el `hashchange`, abre desplegable y ficha y hace scroll) y `prepararBuscador()`. `NOMBRES_CATEGORIA` y `MAXIMO_RESULTADOS` (30).
- Carrusel: `prepararCarrusel(galeria)` (crea los puntitos tras la galería y marca el activo según la foto más centrada) y `prepararCarruseles()`.
- LA LISTA: `prepararMapaLista()` (muestra el botón de pantalla completa si el navegador lo permite).
- Nombres: `NOMBRES_CORREGIDOS` y `textoExcursion(categoria, excursion)` (ver "Formato de los nombres de las excursiones").
- Compartir: `URL_WEB`, `EMOJI_CATEGORIA`, `EMOJI_DATO`, `textoCompartir(...)`, `compartirExcursion(...)` y `crearBotonCompartir(...)` (ver "Botón COMPARTIR").
- Cerrar y subir: `crearBotonCerrar(desplegable)`, `prepararCierresGuia()`, `DISTANCIA_FLECHA_SUBIR`, `actualizarBotonSubir()` y `prepararBotonSubir()`.
- `iniciarApp()` llama, en orden, a `pintarCategorias()`, `prepararContador()`, `prepararBuscador()`, `prepararCarruseles()`, `prepararMapaLista()`, `prepararCierresGuia()`, `prepararBotonSubir()`, `iniciarRelojSanfermines()` y `mostrarPantalla(...)`.
- `GRUPOS_NUEVOS`: grupos que no están en la hoja Resumen (de momento, "Viaje veraniego" en Lugares), con su color.
- `FICHAS_CON_FOTO` y `crearContenidoFoto(...)`: fichas que solo muestran una foto con pie (Menorca).
- Los desplegables y las fichas usan `<details>`/`<summary>`. Los textos se insertan con `textContent`, nunca con `innerHTML`.

## Convenciones de código

- **Idioma**: la interfaz, los comentarios y los mensajes al usuario van en español. Los nombres de variables y funciones también, en camelCase (`listaExcursiones`, `marcarCompletada`).
- **Indentación**: 2 espacios. Codificación UTF-8.
- **HTML**: semántico (`header`, `main`, `section`, `button`…), con `lang="es"` y la etiqueta `meta viewport`.
- **CSS**: colores, tamaños y fuentes en variables CSS dentro de `:root`. Unidades relativas (`rem`, `%`). Las zonas que se tocan con el dedo miden al menos 44 px. No se usan estilos en línea.
  - *Excepción aceptada:* los colores que vienen del Excel (grupos de Montes y Lugares, y etiquetas de popularidad) se pasan desde `app.js` como variables CSS en el propio elemento (`--color-tipo`, `--color-tipo-letra`, `--color-etiqueta`, `--color-etiqueta-letra`).
- **JavaScript**:
  - `const` y `let`, nunca `var`.
  - Funciones pequeñas con una sola responsabilidad.
  - El acceso a localStorage pasa siempre por `storage.js` (`leerDato`, `guardarDato`), envuelto en `try/catch`.
  - Las claves de localStorage llevan el prefijo `excursionesNavarra_`.
  - No se usan `alert()` ni `confirm()` para los mensajes al usuario: se muestran dentro de la propia interfaz.
- **Accesibilidad**: buen contraste, `alt` en las imágenes, `label` en los controles y uso posible con teclado.
- **Nombres del Excel**: se muestran con mayúscula inicial y nombres propios en mayúscula, mediante `NOMBRES_CORREGIDOS` (ver "Formato de los nombres de las excursiones"). Fuera de eso no se corrigen erratas.

## Restricciones

### Del proyecto (obligatorias)

1. **No modificar nunca la base de datos de excursiones en Excel** (`La_Lista_rutas_por_dificultad_1.xlsx` o cualquier otro Excel que aporte el usuario). Ni editarla, ni sobrescribirla, ni moverla, ni renombrarla, ni borrarla. Solo se puede leer.
2. **No hacer ningún cambio en la web que no se haya pedido expresamente.** Nada de mejoras, refactorizaciones, cambios de estilo ni funciones "por iniciativa propia". Si conviene cambiar algo, primero se propone y se espera la aprobación.

### Generales

3. Antes de borrar o sobrescribir un archivo, se avisa y se pide confirmación.
4. No se añaden dependencias, librerías externas ni servicios en la nube sin aprobación.
5. Los datos del usuario no se envían a ningún sitio: todo se queda en el dispositivo.
6. No se rompe lo que ya funciona. Tras cada cambio, se comprueba que la web carga bien en un ancho de escritorio y en uno de móvil.
7. El código debe seguir siendo simple y legible para alguien con conocimientos básicos.
8. Si una instrucción es ambigua, se pregunta antes de actuar.
9. No se hacen commits, subidas ni publicaciones sin petición expresa.

## Git

- Rama `main`. El autor de los commits es genérico (`Excursiones Navarra <excursiones@localhost>`) y solo está configurado en este repositorio.
- **Remoto `origin`**: https://github.com/irozasmate1-source/excursiones-navarra (repositorio público del propietario).
- **GitHub Pages** activado desde la rama `main`, carpeta `/ (root)`. Cada `git push` a `main` actualiza la web en uno o dos minutos.
- **Actualizar la web**: hacer los cambios → commit → `git push`. Si los cambios vienen del Excel, antes hay que regenerar `datos.js`. Commits y subidas solo con petición expresa del propietario (restricción 9).
- La autorización para subir la guarda el administrador de credenciales de Git en Windows. Si caduca, el `git push` abre el navegador para volver a iniciar sesión en GitHub (lo hace el propietario).
- **El Excel se queda fuera de git** por decisión del propietario (no se ha subido a GitHub; la web no lo necesita).
- Los commits terminan con la línea `Co-Authored-By` de Claude.

## Notas técnicas

- **Probar la web:** con doble clic funciona. El navegador integrado de Claude, en cambio, no carga los CSS ni los JS relativos al abrir un `file://`, así que para verla se usa un servidor local temporal. Python no está instalado, por eso se usa un pequeño servidor de PowerShell en la carpeta temporal, que no forma parte del proyecto. Si el navegador muestra una versión antigua, se recarga con un parámetro distinto (`?v=N`) o con Ctrl+F5.
- **Leer el Excel**: `Expand-Archive` no acepta la extensión `.xlsx`; hay que renombrar la copia a `.zip` antes de descomprimirla.
- **localStorage** es propio de cada navegador y de cada dispositivo. Lo marcado en el PC no aparece en el móvil, y al revés, salvo que más adelante se añada exportar e importar.
- **Android y compartir la web**: Chrome para Android no abre bien archivos locales, y Google Drive no muestra HTML como página. Subir solo `index.html` no funciona, porque depende de `css/`, `js/` e `img/`. Por eso se publicó en GitHub Pages (ver "Publicación"). GitHub Pages distingue mayúsculas y minúsculas: los nombres de archivo y las rutas del HTML/JS deben coincidir exactamente.
- **Favicon**: Chrome y Edge no muestran el icono de la pestaña al abrir `index.html` con doble clic (`file://`); se ve en la web publicada. Tras cambiarlo, el navegador puede tardar en refrescarlo (Ctrl+F5).
- **Quitar el fondo blanco de una imagen**: relleno por inundación desde los bordes (solo el blanco conectado al exterior), para no borrar blancos interiores como los dientes de la cara enfadada.
- **Casillas en la web publicada**: se guardan en el navegador de cada persona; cada uno ve sus propias marcas, no las del propietario.
- **Iconos en vez de emoticonos**: los emoticonos se veían distintos en Windows y Android (Windows no dibuja banderas: 🇫🇷 salía como "FR"). Los SVG de `img/iconos/` se ven igual en todos los dispositivos y funcionan con doble clic (`file://`).
- **Comprobar enlaces del mapa**: abrir la URL de búsqueda en el navegador y mirar el título de la pestaña (nombre del lugar = lo encontró; la búsqueda repetida = lista de resultados). La primera vez Google pide cookies: se elige "Rechazar todo". Wikiloc no deja leer sus páginas con descarga directa (403), pero sí desde el navegador; el punto de inicio está en el HTML de la ruta.
