# Validación de la continuación

Estado final: **301 productos / 301 identidades de imagen, paridad PASS**. Las pruebas se ejecutaron sobre los cambios locales existentes, sin restablecer Git ni crear commits, push o despliegues.

## Comandos ejecutados

| Proyecto | Comando | Resultado |
| --- | --- | --- |
| Web | `npm run catalog:sync` | PASS; siete correcciones reaplicadas, 301 productos |
| Web | `npm run catalog:check` | PASS; campos y recursos comparados por ID |
| Web | `npm run lint` | PASS |
| Web | `npm run test` | **56/56 PASS** |
| Web | `npm run build` | PASS; 302 documentos de metadatos de catálogo/detalle |
| Web | `python3 scripts/catalog/research_ledger.py` | PASS; registro reproducible, 757 pendientes |
| Web | `python3 -m py_compile scripts/catalog/import_enrichment.py scripts/catalog/research_ledger.py` | PASS |
| App | `npm run typecheck` | PASS |
| App | `npm run lint` | PASS |
| App | `npm run test` | **18/18 PASS** |
| Ambos | `git diff --check` | PASS |

Exportaciones de la app, ejecutadas desde `rockwall-fireworks-mobile` con `CI=1 EXPO_OFFLINE=1`:

```sh
npx expo export --platform ios --max-workers 1 --output-dir artifacts/catalog-continuation/ios-export
npx expo export --platform android --max-workers 1 --output-dir artifacts/catalog-continuation/android-export
npx expo export --platform web --max-workers 1 --output-dir artifacts/catalog-continuation/web-export
```

**Las tres terminaron correctamente.** Los bundles iOS/Android incluyen bytecode Hermes. Además del resultado del exportador, se compararon por SHA-256 las 301 imágenes comerciales contra los recursos incluidos en cada exportación: ninguna faltante. Ver [app-export-validation.json](app-export-validation.json). No son builds firmados ni publicaciones.

Los primeros intentos fallaron con `ENOSPC` y `LLVM ERROR: IO failure ... No space left on device`. Se recuperó espacio únicamente de caches/artefactos creados durante esta tarea, preservando fotografías aprobadas, índices de fuentes y los archivos del usuario. Los reintentos anteriores no se cuentan como exportaciones aprobadas; los tres resultados finales sí.

## Cobertura automatizada

- Siete marcas confirmadas, aplicación repetible y fallo ante cambio de ID/nombre/foto protegida. Festival Balls de Black Cat y de Monkey Mania permanecen separados.
- Identificadores y slugs únicos; nombres canónicos de marcas; Firehawk con logo local; ausencia de códigos de identidad duplicados entre aprobaciones.
- Paridad de nombre, marca, categoría, presentación, descripción, características, modelo, orden, condición de destacado y video/ausencia. Rutas e identidades/hashes de imágenes web, responsivas y app.
- Cada una de las 1013 filas iniciales tiene un resultado explícito, un token único, evidencia/consultas y, si corresponde, un siguiente paso. Las fotografías de los 251 productos nuevos conservan el SHA-256 aprobado.
- Búsqueda y filtros combinados; favoritos por ID, datos corruptos y almacenamiento deshabilitado; videos exactos admitidos y rechazo de enlaces de búsqueda. Se corrigió la normalización de iniciales en “U.S. 66” para que no se confunda con cualquier producto de 66 disparos.
- Favoritos históricos de la app conservados con la misma clave; PNG anteriores y WebP nuevos resuelven a recursos empaquetados.
- Las pruebas existentes del hero estático/animado, limpieza y pausas, debug sólo de desarrollo, temporadas y límites America/Chicago siguen pasando.

## Revisión visual de la web

Chrome de escritorio en macOS, con overrides de viewport **1440×1000**, **820×1180** y **390×844**. Son simulaciones de tamaño; no dispositivos físicos ni una medición de rendimiento móvil real.

- Selector Firehawk: logo íntegro, escala comparable, contraste en fondo azul, nombre accesible, selección visible y tres productos correctos. Combinación Firehawk+Missiles: un resultado; Firehawk+Fountains: estado vacío correcto; limpiar filtros: 301 productos.
- Las siete páginas corregidas muestran su marca esperada. [Registro del navegador](screenshots/brand-pages.json).
- En tablet se recorrieron las 25 ampliaciones de “Show more” hasta **301/301**. Las 301 imágenes terminaron cargadas, no hubo imágenes fallidas ni overflow horizontal; todas las tarjetas midieron **230×464 px**. [Registro completo](screenshots/expanded-catalog-tablet.json). La carga inicial continúa siendo de 12 tarjetas.
- Revisión de imágenes completas, tarjetas y detalles en escritorio/móvil, incluidos Flag Missile Battery y The Reaper. No se alteró el envase aprobado.
- Favorito de Flag Missile Battery agregado desde una tarjeta, mantenido después de recargar y accesible mediante Saved favorites; se retiró al terminar la prueba para restaurar el estado inicial del navegador.
- Navegación con Tab: foco visible de 3 px. Filtros, botones y enlaces siguen disponibles sin hover. La fila de marcas se desplaza y mantiene la selección visible en pantallas estrechas.
- Video Flag Missile Battery: ningún iframe antes de interactuar; después de Load video aparece el reproductor YouTube nocookie y su control Play, sin autoplay. Se verificó título/canal y enlace externo. Ring of Honor sin video: ningún bloque vacío. No se reprodujeron completamente todos los videos del catálogo.
- Home: los 11 logos se ven completos y cargados, incluida Firehawk sobre blanco; 6+5 en tablet y 4+4+3 en móvil. Hero de Dallas y composición de productos conservados.
- No se observó overflow horizontal en los tamaños inspeccionados. Los recursos aprobados anteriores conservaron sus hashes.

Capturas: [selector escritorio](screenshots/firehawk-desktop.jpg), [selector móvil](screenshots/firehawk-mobile.jpg), [The Reaper corregido](screenshots/the-reaper-desktop.jpg), [Flag Missile Battery móvil](screenshots/flag-missile-mobile.jpg) y [marcas de la home móvil](screenshots/home-brands-mobile.jpg).

## Límites reales

- La consola **no quedó completamente limpia**: Chrome registró errores internos de almacenamiento `FILE_ERROR_NO_SPACE` durante esta sesión de disco lleno. No aparecieron errores de React ni imágenes 404 en las comprobaciones realizadas. Se conserva el [registro de consola](screenshots/console.json); no se borró el almacenamiento ni los favoritos del usuario para ocultar esos mensajes. Conviene volver a comprobar con espacio libre estable.
- La herramienta de uso de computadora rechazó controlar `com.apple.iphonesimulator`: informó que Simulator no estaba aprobado. El listado de dispositivos sí pudo consultarse, pero **no se ejecutó la app en un simulador ni en un dispositivo**. También se rechazó abrir un servidor adicional para la exportación web (`Operation not permitted`). La comprobación de la app fue estática, de tests y de exportación; interacción nativa, lector de pantalla y persistencia tras reiniciar una app instalada quedan pendientes.
- Las 757 filas de inventario pendientes no están publicadas. Sus motivos se agrupan en el [informe](README.md) y se detallan individualmente en el CSV. Fotografías pequeñas conservan su resolución real. Los videos pueden cambiar de disponibilidad o permiso de incrustación; hay enlaces externos de respaldo.
- No se verificó Hostinger en producción: no hubo despliegue. Los metadatos, sitemap y configuración de rutas existentes se comprobaron localmente.

Vista previa web de desarrollo dejada funcionando en **http://127.0.0.1:5175/products?brand=Firehawk**, con el debug del countdown oculto. Para reiniciarla, desde la web: `npm run dev -- --host 127.0.0.1 --port 5175`. `catalog:sync` y `catalog:check` siguen siendo los comandos de mantenimiento; no editar los archivos generados de la app.
