# CLAUDE.md

## Descripción del proyecto

**EXCURSIONES POR NAVARRA Y COMPAÑÍA** es una aplicación web para gestionar excursiones por Navarra.

- La pantalla principal muestra el título **EXCURSIONES POR NAVARRA Y COMPAÑÍA**.
- El usuario ve una lista de excursiones y puede marcarlas como completadas.
- Las excursiones vienen de un archivo Excel que aporta el propietario del proyecto. Ese Excel es solo de lectura.
- La web debe abrirse y funcionar tanto en PC (Windows) como en móvil (Android).
- Todos los datos del usuario (por ejemplo, qué excursiones ha completado) se guardan en local, en el navegador del dispositivo. No hay servidor ni base de datos remota.

El proyecto avanza por fases. Solo se implementa lo que se pida en cada momento.

## Tecnologías

- **HTML5, CSS3 y JavaScript** sin frameworks ni herramientas de compilación.
- **localStorage** para guardar los datos del usuario.
- **SheetJS (xlsx)** para leer el Excel de excursiones. Se guarda una copia local de la librería en `/lib` para que funcione sin internet.
- Diseño **responsive** pensado primero para el móvil (*mobile-first*).
- Sin dependencias de Node ni npm: la web debe poder abrirse haciendo doble clic en `index.html`.

## Estructura de archivos

```
/
├── CLAUDE.md               # Este documento
├── index.html              # Pantalla principal
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── app.js              # Lógica principal e interfaz
│   ├── storage.js          # Lectura y escritura en localStorage
│   └── excel.js            # Lectura del Excel de excursiones (solo lectura)
├── lib/
│   └── xlsx.full.min.js    # Librería SheetJS (copia local)
└── datos/
    └── excursiones.xlsx    # Base de datos de excursiones (NO MODIFICAR)
```

Los archivos nuevos deben seguir esta estructura. Si hace falta otra carpeta o archivo, se avisa antes de crearlo.

## Convenciones de código

- **Idioma**: la interfaz, los comentarios y los mensajes al usuario van en español. Los nombres de variables y funciones también, en camelCase (`listaExcursiones`, `marcarCompletada`).
- **Indentación**: 2 espacios. Codificación UTF-8.
- **HTML**: semántico (`header`, `main`, `section`, `button`…), con `lang="es"` y la etiqueta `meta viewport`.
- **CSS**: colores, tamaños y fuentes en variables CSS dentro de `:root`. Unidades relativas (`rem`, `%`). Las zonas que se tocan con el dedo miden al menos 44 px. No se usan estilos en línea.
- **JavaScript**:
  - `const` y `let`, nunca `var`.
  - Funciones pequeñas con una sola responsabilidad.
  - El acceso a localStorage pasa siempre por `storage.js`, envuelto en `try/catch`.
  - Las claves de localStorage llevan el prefijo `excursionesNavarra_`.
  - No se usan `alert()` ni `confirm()` para los mensajes al usuario: se muestran dentro de la propia interfaz.
- **Accesibilidad**: buen contraste, `alt` en las imágenes, `label` en los controles y uso posible con teclado.

## Restricciones

### Del proyecto (obligatorias)

1. **No modificar nunca la base de datos de excursiones en Excel** (`datos/excursiones.xlsx` o cualquier otro Excel que aporte el usuario). Ni editarla, ni sobrescribirla, ni moverla, ni renombrarla, ni borrarla. Solo se puede leer.
2. **No hacer ningún cambio en la web que no se haya pedido expresamente.** Nada de mejoras, refactorizaciones, cambios de estilo ni funciones "por iniciativa propia". Si conviene cambiar algo, primero se propone y se espera la aprobación.

### Generales

3. Antes de borrar o sobrescribir un archivo, se avisa y se pide confirmación.
4. No se añaden dependencias, librerías externas ni servicios en la nube sin aprobación.
5. Los datos del usuario no se envían a ningún sitio: todo se queda en el dispositivo.
6. No se rompe lo que ya funciona. Tras cada cambio, se comprueba que la web carga bien en un ancho de escritorio y en uno de móvil.
7. El código debe seguir siendo simple y legible para alguien con conocimientos básicos.
8. Si una instrucción es ambigua, se pregunta antes de actuar.
9. No se hacen commits, subidas ni publicaciones sin petición expresa.

## Notas técnicas

- **Excel y `file://`**: si la web se abre con doble clic, el navegador no puede leer por su cuenta archivos de la carpeta. Para cargar el Excel, el usuario lo elige con un selector de archivos (`<input type="file">`). La alternativa es convertir los datos a un archivo `.js` o `.json`; esto se decidirá en la fase del Excel.
- **localStorage** es propio de cada navegador y de cada dispositivo. Lo marcado como completado en el PC no aparece en el móvil, y al revés, salvo que más adelante se añada exportar e importar.
- **Android**: Chrome para Android no abre bien archivos locales `file://`. Habrá que elegir una forma de abrir la web en el móvil (por ejemplo, un servidor local o alojarla en una web estática) cuando se llegue a esa fase.
