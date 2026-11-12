# CLAUDE.md

## Descripción del proyecto

**EXCURSIONES POR NAVARRA Y COMPAÑÍA** es una aplicación web para gestionar excursiones por Navarra.

- La pantalla principal muestra el título **EXCURSIONES POR NAVARRA Y COMPAÑÍA**, un mapa de Navarra con una rosa de los vientos, cuatro botones de categoría y un acceso aparte a las excursiones completadas.
- Las excursiones vienen de un archivo Excel que aporta el propietario del proyecto. Ese Excel es solo de lectura.
- La web debe abrirse y funcionar tanto en PC (Windows) como en móvil (Android).
- Todos los datos del usuario (por ejemplo, qué árboles ha visitado) se guardan en local, en el navegador del dispositivo. No hay servidor ni base de datos remota.

El proyecto avanza por fases. Solo se implementa lo que se pida en cada momento.

## Estado actual (qué hay hecho)

### Pantalla principal (`#inicio`)
- Cabecera con el título, mapa de Navarra sin fondo (`img/mapa-navarra.png`) y rosa de los vientos encima (`img/rosa-vientos.svg`).
- Cuatro botones: **Lugares y pueblos**, **Montes/paseos**, **Bicicleta** y **Monumentos Naturales de Navarra**.
- Botón aparte: **Excursiones completadas**.

### Pantallas de categoría
- Navegación por `#hash` (`#lugares`, `#montes`, `#bicicleta`, `#monumentos`, `#completadas`). Funciona con doble clic y con el botón "atrás" del móvil.
- Todas tienen una flecha (←) para volver a la pantalla principal.
- Galería de imágenes con borde negro y proporción 4:3 encima de la lista. Excepción: en Monumentos, el cartel (`monumentos-1-mapa.png`) va completo, sin recortar, debajo de la lista, y la foto del árbol, que está sola, tiene el tamaño de una imagen de galería de tres.

| Categoría (web) | Hoja del Excel | Cómo se muestra |
|---|---|---|
| Montes/paseos | Rutas (120) | 13 desplegables por **Tipo**, con el color del Excel y un icono. Dentro, rutas de dificultad 1 → 5 con etiqueta de dificultad. Cada ruta abre una **ficha** con coche desde Pamplona, distancia, desnivel, tipo de ruta, zona, ruta habitual, notas, fuente de los km, botón a Wikiloc si lo hay y recuadro **VER EN EL MAPA**. |
| Lugares y pueblos | Lugares a los que ir (113) | 16 desplegables por **Categoría**, con el color del Excel y un icono. Dentro, de más a menos popular, con etiqueta de popularidad (colores del Excel). Cada lugar abre una **ficha** con coche, zona, qué es, notas, datos de ruta, Wikiloc si lo hay y **VER EN EL MAPA**. |
| Monumentos Naturales | Árboles singulares (48) | Sin desplegables generales. Lista ordenada por número (`MN Nº1 - ENCINA DE ERAUL`, el no oficial al final), con un icono según el tipo de árbol. Cada árbol abre una **ficha** con tipo, especie, municipio, coche, nombre en tu mapa (si difiere), notas y **VER EN EL MAPA**. **No se muestra la columna "Estado".** Tiene **casilla de visitado** visible sin abrir la ficha. |
| Bicicleta | Bici (11) | Sin desplegables generales. Cada excursión lleva un icono según su categoría y abre una **ficha** con coche, km en bici, tipo de recorrido, categoría, zona, qué es, notas, fuente de los km y **VER EN EL MAPA**. Sin casilla. |
| Excursiones completadas | Completadas (32) | Solo la lista de nombres, en el orden de la hoja. Sin mapa. |

### Iconos
- Las categorías y los datos de las fichas usan **iconos SVG propios** (`img/iconos/*.svg`, 55 archivos), dibujados con colores naturales y estilo ilustrado sobrio. **No se usan emoticonos** (se sustituyeron para dar un aspecto más profesional). La estrella ★ de la popularidad es un carácter tipográfico y se mantiene.
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

### Casilla de visitado (solo Monumentos)
- Al marcarla no ocurre nada más: no cambia de categoría ni se mueve. Solo sirve para llevar la cuenta.
- Se guarda en localStorage con la clave `excursionesNavarra_monumentosVisitados`: un array de identificadores (`MN-1`, `MN-2`…, o el nombre si el árbol no tiene número).

### Pendiente o no abordado todavía
- Marcar excursiones como completadas en otras categorías y relacionarlo con la hoja Completadas.
- Abrir la web en el móvil (Android) o compartirla, por ejemplo por Drive o WhatsApp. Se ha hablado, pero se aparca por decisión del propietario.

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
    ├── iconos/*.svg                       # Iconos de categorías y fichas (55)
    ├── mapa-navarra.png, rosa-vientos.svg # Pantalla principal
    ├── montes-*.{webp,png}                # Galería de Montes/paseos (3)
    ├── lugares-*.{webp,png}               # Galería de Lugares y pueblos (3)
    ├── bicicleta-*.webp                   # Galería de Bicicleta (2)
    └── monumentos-*.png                   # Cartel y foto del árbol de Monumentos
```

Orden de carga de scripts en `index.html`: `datos.js`, `storage.js`, `excel.js`, `app.js`.

Los archivos nuevos deben seguir esta estructura. Si hace falta otra carpeta o archivo, se avisa antes de crearlo.

## Flujo de datos del Excel

1. Se copia el Excel a una carpeta temporal y se lee esa copia (es un `.xlsx`, o sea, un zip de XML). **El original nunca se abre para escribir.** Se comprueba su huella MD5 antes y después.
2. Un script de PowerShell genera `js/datos.js` con el objeto `EXCURSIONES`:
   - `montes`, `lugares`, `monumentos`, `bicicleta`, `completadas`: las filas de cada hoja, en el orden de la hoja. `app.js` se encarga de ordenar.
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
  - `marcable`: si lleva casilla de visitado.
  - `mapa`: texto de búsqueda (o coordenadas) para Google Maps.
  - `datos`: los recuadros de la ficha (`[icono, etiqueta, valor]`).
  - `bloques`: los textos de la ficha.
- Las categorías sin configuración (Completadas) muestran solo nombres.
- Iconos: `crearIcono(nombre, clase)` crea un `<img>` decorativo de `img/iconos/<nombre>.svg`. Los mapas de iconos guardan el nombre del archivo sin `.svg`: `ICONOS_TIPO` (Montes), `ICONOS_CATEGORIA_LUGAR` (Lugares), `ICONOS_ARBOL` (Monumentos, buscado por el comienzo del tipo de árbol) e `ICONOS_BICI` (Bicicleta).
- Mapa: `busquedaMapa(...)`, `crearEnlaceMapa(busqueda)`, `COORDENADAS_MONUMENTOS` y `CORRECCIONES_MAPA` (ver "Enlace VER EN EL MAPA").
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
- **Nombres del Excel**: se muestran tal cual, sin corregir mayúsculas ni erratas (salvo el formato MN de Monumentos, que va en mayúsculas).

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

- Repositorio local en la rama `main`, sin remoto. El autor de los commits es genérico (`Excursiones Navarra <excursiones@localhost>`) y solo está configurado en este repositorio.
- **El Excel se queda fuera de git** por decisión del propietario.
- Los commits terminan con la línea `Co-Authored-By` de Claude.

## Notas técnicas

- **Probar la web:** con doble clic funciona. El navegador integrado de Claude, en cambio, no carga los CSS ni los JS relativos al abrir un `file://`, así que para verla se usa un servidor local temporal. Python no está instalado, por eso se usa un pequeño servidor de PowerShell en la carpeta temporal, que no forma parte del proyecto. Si el navegador muestra una versión antigua, se recarga con un parámetro distinto (`?v=N`) o con Ctrl+F5.
- **localStorage** es propio de cada navegador y de cada dispositivo. Lo marcado en el PC no aparece en el móvil, y al revés, salvo que más adelante se añada exportar e importar.
- **Android y compartir la web**: Chrome para Android no abre bien archivos locales, y Google Drive no muestra HTML como página. Subir solo `index.html` no funciona, porque depende de `css/`, `js/` e `img/`. Las opciones viables son un hosting estático (Netlify Drop, GitHub Pages…), sin subir el Excel, o un único HTML con todo dentro. Está aparcado; antes de publicar, revisar qué notas personales se muestran.
- **Iconos en vez de emoticonos**: los emoticonos se veían distintos en Windows y Android (Windows no dibuja banderas: 🇫🇷 salía como "FR"). Los SVG de `img/iconos/` se ven igual en todos los dispositivos y funcionan con doble clic (`file://`).
- **Comprobar enlaces del mapa**: abrir la URL de búsqueda en el navegador y mirar el título de la pestaña (nombre del lugar = lo encontró; la búsqueda repetida = lista de resultados). La primera vez Google pide cookies: se elige "Rechazar todo". Wikiloc no deja leer sus páginas con descarga directa (403), pero sí desde el navegador; el punto de inicio está en el HTML de la ruta.
