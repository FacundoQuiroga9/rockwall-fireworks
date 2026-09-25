# Validación — 24 de septiembre de 2026

Vista previa de desarrollo: **http://127.0.0.1:5175/products**. Reiniciar si fuera necesario con `npm run dev -- --host 127.0.0.1 --port 5175` desde la web. No hubo despliegue ni publicación.

## Comandos

| Comprobación | Resultado |
| --- | --- |
| Web `npm run catalog:sync` y `npm run catalog:check` | PASS: 302 productos e identidades de imagen, comparación por ID y todos los campos comerciales/recursos |
| Web `npm run lint` | PASS |
| Web `npm run test` | 60/60 PASS |
| Web `npm run build` | PASS final; 303 rutas de metadatos generadas |
| `cmp public/.htaccess dist/.htaccess` | PASS |
| Apache 2.4.66 `httpd -t` incluyendo explícitamente `dist/.htaccess` | Syntax OK |
| App `npm run typecheck` y `npm run lint` | PASS |
| App `npm run test` | 18/18 PASS |

La exportación Expo iOS/Android/web terminó correctamente durante esta iteración (`CI=1 npx expo export --platform all --max-workers 1 --output-dir dist`). No se repitió después de la última limpieza de subtítulos y características redundantes por falta de espacio; esos datos finales sí pasaron TypeScript, tests y paridad. Su salida temporal se retiró para recuperar espacio. Esto no equivale a ejecutar la app en simulador o dispositivo. Logs en `artifacts/catalog-presentation/` (ignorados por Git).

Pruebas nuevas: persistencia/idempotencia de la revisión editorial; identidad protegida y correcciones de marca; logos locales y MORE al final; límites completos de objeto/sombra y hashes originales; ausencia de ampliación; separación del four-pack Party Sparklers y su display. Siguen pasando las verificaciones previas de favoritos/IDs, filtros, slugs, videos opcionales y paridad.

`change-audit.json` compara contra hashes del comienzo de la sesión: hero, sus imágenes, temporadas y navegación intactos. Los 301 IDs anteriores permanecen. La app sólo recibió datos/modelos/mapa de imágenes generados, recursos y ajustes en su prueba de catálogo.

## Navegador

Chrome en macOS: **1440×960**, **768×1024** y **390×844**. Son simulaciones de tamaño, no teléfonos ni tablets físicos, ni pruebas de rendimiento móvil real.

- Catálogo: revisión de Cakes, Fountains y Assortments, formatos altos/anchos y múltiples paquetes. Además se inspeccionaron las 11 hojas de contacto que cubren los 302 recursos y todas las categorías.
- Medidas uniformes observadas: 306×344 px escritorio, aproximadamente 214×344 tablet y 169×320 móvil. Ningún botón anidado en un enlace. Espacio de imagen reservado e imágenes completas, sin recursos rotos en las vistas inspeccionadas.
- Favoritos: guardar desde la card no navega; persiste al recargar. El favorito de prueba se retiró para volver al estado inicial (cero).
- Filtros combinados Winda + Cakes: 16 resultados; Bright Star + Fountains: estado vacío y limpieza funcional.
- Arrastre con mouse desplaza sin seleccionar al soltar. Controles deshabilitados en límites. MORE al final. Tab muestra foco sólido de 3 px; Enter activa marca y abre el enlace de una card. Selección móvil sin depender de hover. Logos revisados también en home; Fox y Pyro Shine cuentan con soporte tonal sobre blanco.
- Detalles: Freedom’s Wings con información verificada; Snow Cone completo y sin P3088 como descripción; Party Sparklers nuevo sin texto ni video inventados. Imagen de 430 px en escritorio y 280 px en móvil en esos viewports.
- Apertura de una card en otra pestaña mediante Meta-clic, acceso directo y recarga conservan la URL en Vite. Esto no demuestra funcionamiento en Hostinger.
- Video 3 Min: cero iframes antes de pulsar Load video; después se crea `youtube-nocookie.com/embed/f9FzaW2jNRQ?rel=0`, sin autoplay. Party Sparklers no genera un bloque de video vacío.
- Sin overflow horizontal en las pantallas revisadas. Se conservaron CSS y comportamiento del selector para movimiento reducido, pero no se completó la emulación visual de esa preferencia: la revisión automática rechazó el acceso nativo a Chrome. No se eludió el rechazo.

No se observaron errores de React/aplicación. Sí se registraron errores de E/S de Chrome `FILE_ERROR_NO_SPACE`; no se presenta la consola como completamente limpia. Hubo fallos ENOSPC intermedios en builds y capturas. Se retiraron únicamente salidas temporales/reproducibles y se deduplicaron originales archivados sin cambiar bytes. Después del build final, `dist/images` se reprodujo mediante clones APFS de copia en escritura (`cp -cR`): archivos independientes con los mismos bytes, sin enlaces simbólicos ni rutas externas. Conviene liberar al menos 1 GB antes de la próxima exportación de la app.

## Capturas

- [Catálogo escritorio](screenshots/catalog-desktop.png), [móvil](screenshots/catalog-mobile.png), [tablet](screenshots/catalog-tablet.png).
- [Selector escritorio](screenshots/brands-desktop.png), [móvil](screenshots/brands-mobile.png).
- [Logos en home escritorio](screenshots/brands-home-desktop.png), [móvil](screenshots/brands-home-mobile.png).
- [Freedom’s Wings escritorio](screenshots/detail-desktop.png), [móvil](screenshots/detail-mobile.png).
- [Snow Cone móvil](screenshots/snow-cone-mobile.png).
- [Party Sparklers nuevo](screenshots/party-sparklers-mobile.png).

## Pendientes reales

1. Apache/LiteSpeed/Hostinger: el inicio de Apache local en 127.0.0.1:5180 fue rechazado con `Operation not permitted`. Se validó sintaxis, pero faltan GET reales para rutas SPA, archivos y recursos inexistentes. Hosting intacto; base raíz `/`, sin evidencia de subcarpeta.
2. App: ninguna ejecución en simulador/dispositivo. Repetir exportación del estado editorial final cuando haya espacio y probar formatos extremos/favoritos en un dispositivo.
3. Movimiento reducido: inspección visual emulada pendiente; reglas y tests existentes conservados.
4. Previews sociales sin JavaScript: `.htaccess` sirve `index.html`; React actualiza metadatos. Los HTML por producto se generan, pero no son el destino de la reescritura. No se afirma validación de previews de terceros.
