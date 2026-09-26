# Validación — 2026-09-26

## Resultado automatizado

- Web: `npm run catalog:sync`, `npm run catalog:check`, `npm run lint`, **139 pruebas**, `npm run build`: PASS. 302 identidades y paridad de datos/código/recursos con app. 303 rutas de metadatos. Aviso existente de chunk PDF de aproximadamente 1,49 MB; no se cambió el PDF ni se ocultó el aviso.
- App: `npm run typecheck`, `npm run lint`, **56 pruebas**: PASS. Exportación `npx expo export --platform all --output-dir /private/tmp/rockwall-controls-export-final`: Android, iOS y web PASS. Exportaciones temporales fuera de Git; no publicación.
- Pruebas nuevas: alias Reloadables, normalización persistente, elegibilidad anterior frente a la nueva, separación de grupos BOGO, snapshots/cantidades; tres cakes + shell, primer disparo único, eventos/cuentas independientes, límite conocido/desconocido, pulsaciones rápidas, pausa/continuación, reinicio por producto/global, disparos después de las cakes, limpieza de selección; nueva escena compatible; calidad con histéresis, densidad real, presupuesto/píxeles, tiempos intactos, estrellas deterministas; error de audio sin falso estado running. Las suites existentes siguen cubriendo colas de fountain, fotos estables, transición de escena con liberación de audio/RAF/canvas, ruta/ancla de referencia, PDF/promociones/favoritos e identidades. Los cambios intencionales de metadatos y grupos se normalizan explícitamente al comparar los baselines históricos; no se sustituyeron esos baselines por el estado actual.

## Revisión visual y movimiento

[Grabación de tres cakes y shells manuales](review/three-cakes-manual-shell.webm): **52,15 s**, 1294 × 820, VP9, sin audio. 980 capturas continuas de la interfaz real (aproximadamente 18,8 capturas/s), codificadas con sus tiempos originales. Esto no es el FPS del motor. [Tiempos y acciones](review/manual-capture.json): Ghostacular + Bump Bear + Band of Brothers + Golden Peacock; primer lanzamiento con Play; lanzamientos por teclado a 6,3 y 13,2 s; pausa/continuación a 19,7/21,9 s sin aumentar el contador; sonido desactivado/activado; cuarto shell a 45,4 s cuando ya habían terminado las cakes. Contador final 4/24, estado Ready for another shell, sin partículas restantes. El archivo guardado se reabrió en el navegador y confirmó duración y metadata completas. El encoder decodifica secuencialmente para no mantener cientos de bitmaps en memoria. Los cuadros intermedios están en `artifacts/` ignorado; sólo grabación y metadatos de revisión se versionan.

Los cuatro perfiles nuevos se reprodujeron y compararon con los cuadros de su referencia. Ladybugs conserva giro rojo, ascenso y dispersión plateada; se mejoró el tamaño legible de sus puntos en el encuadre cercano. La candle tiene diez estrellas independientes y pausa natural desigual; no hay explosión artificial. Skybolt se corrigió tras la comparación: largos de ramas irregulares, interior pálido más visible y puntas rojas que se apagan antes. Nishiki conserva apertura dorada y caída lenta; sólo se repite la primera muestra. Capturas en `review/`, fuentes y marcas de tiempo en `evidence/`.

Se verificó en la web pública: seleccionar Ladybugs desde cuatro aéreos cambia a Close effects, guarda cuatro; seleccionar la candle añade el segundo producto cercano; filtrar Cakes no cambia esos dos activos; volver a Dallas recupera los cuatro, con progreso cero y audio sin iniciar. Contador/resumen sólo activos. La lógica de restauración rechaza familias mezcladas. My List no se usó para estas acciones.

[Skyline y estrellas, escritorio](review/sky-wide.png), [compacto vertical](review/compact-portrait.png), [compacto horizontal](review/compact-landscape.png). Viewports revisados: 1440×1000, 390×844 y 844×390. Las dos últimas capturas son el documento compartido en Chrome, **no la app nativa**. El documento compacto arranca en Still preview con movimiento reducido y cero shells lanzados; Space sobre Play animation inicia una sola unidad. Se verificó foco visible y controles de al menos 44 px. En horizontal corto, la app conserva un mínimo de 560 px con desplazamiento exterior para no recortar audio ni deformar el skyline. No se modificó el hero.

[Balanced](review/quality-balanced.png) y [High](review/quality-high.png): mismo Nishiki y tiempo de muestra, cambio visual de densidad/estela, sin cambiar eventos o posición. La transición pausada se revisó esperando sus 1,2 s, sin desaparición del efecto. Los avisos de adaptación también aparecen en la opción seleccionada del control cuando el espacio compacto oculta el texto secundario. Los contadores y estado de calidad sólo actualizan sus regiones accesibles cuando cambia el texto, evitando anuncios repetidos cada 300 ms.

Filtro real `/products?category=Reloadables`: Artillery Shells seleccionado, 38 productos. Ficha Nishiki: “Canister shells · 6 shells per pack”, “Warm gold spokes spread into fine, slowly falling copper-gold trails.” y “Shell sample · Approx. 5 sec”. Watch the reference termina en `/products/nishiki-blast-6-pack#product-video`; foco `video-title`, sección a 114,18 px con header hasta 114,08 px. Cero iframes antes de Load video, uno después: `youtube-nocookie.com/embed/K8poHnGn55w?rel=0`, lazy y sin autoplay. [Captura](review/reference-navigation.png).

## Audio: qué se comprobó

[Señal sintetizada grabada](evidence/audio-signal.webm), [medición](evidence/audio-signal.json). AudioContext real en Chrome, salida después del compresor conectada a destino y MediaStreamDestination, volumen 35%, cuatro lanzamientos/explosiones y envolvente de fountain. Pico digital **0,3041**, RMS máximo **0,1481**, máximo ocho voces simultáneas en ese ensayo, RMS final **0**. La prueba confirma generación de señal, salida digital no saturada y limpieza. El recorrido público confirmó Sound on sólo con contexto running, manuales, pausa y silencio.

**No se confirmó la salida acústica de los parlantes del equipo ni la audibilidad en un dispositivo nativo.** Se pidió una comprobación opcional al usuario; al cerrar el informe no hay confirmación. Ninguna medición de señal se presenta como prueba de audibilidad física. No se extrajo ni redistribuyó audio de YouTube; el material es síntesis original del proyecto.

## Rendimiento acotado

Entorno: Chrome 153 en macOS 26.5.2, ocho procesadores lógicos reportados por el navegador, canvas 1280×640 CSS px, DPR 2 para la batería principal. El nombre real de CPU y RAM física no pudieron leerse con `sysctl` por permisos; el UA no se usa para inferir un modelo de Mac. Coste medido de dibujo de canvas, no tiempo total GPU ni rendimiento nativo. [Resultados completos](evidence/performance-suite.json).

| Caso, 4 productos | Calidad | Duración | FPS dibujados | Dibujo medio / p95 (ms) | Máximo de partículas visibles / puntos dibujados |
| --- | --- | --- | --- | --- | --- |
| Aéreos reales | Balanced | 45 s | 59,64 | 0,258 / 0,50 | 276 / 485 |
| Aéreos reales | High | 45 s | 60,00 | 0,291 / 0,60 | 421 / 574 |
| Fountains reales | High | 45 s | 59,31 | 2,451 / 2,70 | 1545 / 2755 |
| Shells repetidos, cuentas independientes | Balanced | 45 s | 57,26 | 0,505 / 0,90 | 275 / 867 |
| Shells repetidos, cuentas independientes | High | 45 s | 58,44 | 0,637 / 1,10 | 405 / 1173 |
| Fountains, presupuesto compacto en Chrome | High | 45 s | 29,96 | 2,316 / 3,00 | 937 / 1600 |
| Sobrecarga sintética: eventos coincidentes (no perfil público) | High | 15 s | 60,00 | 2,278 / 2,50 | 1734 / 2677 |

Ningún tramo registró intervalos dibujados >50 ms ni necesitó bajar calidad. La batería está acotada a 330 segundos, con tope global incluso en el caso sintético. Heap JS observado aproximadamente 26–36 MB en la batería principal, sin evidencia de acumulación por cada lanzamiento; este pico no equivale a toda la memoria GPU/proceso y no prueba ausencia universal de fugas.

El primer tramo Balanced de fountains incluía la transición inicial desde el valor predeterminado High (pico 2495 puntos mientras bajaba su presupuesto), por lo que no se usa ese pico como presupuesto de Balanced estable. Se repitió con 1,3 s de asentamiento: [45 s adicionales](evidence/performance-balanced-steady.json), máximo **816 partículas / 1400 puntos**, 58,82 FPS, media 3,76 ms y p95 5,4 ms, cero intervalos >50 ms. Este ensayo fue con DPR 1 y una grabación reproduciéndose en otra pestaña; sus tiempos no son una comparación controlada de coste contra DPR 2. La comparación visual sí conserva el mismo viewport, instante y DPR. La batería no se ejecutó hasta bloquear el equipo.

La adaptación está cubierta por pruebas de carga sostenida y recuperación gradual, pero no se observó una reducción automática por carga real en este Mac. Los límites elegidos son prácticos para estos ensayos; se requiere medición en dispositivos reales antes de prometer High en ellos. `activeParticles` cuenta cabezas/partículas visibles, `drawnPoints` incluye estelas y capas de brillo. Un refinamiento posterior del contador incluye también cabezas de lanzamiento y la capa final de los ghosts; no cambia imágenes ni tiempos, y los picos anteriores se conservan como medición del ensayo realizado.

## Límites y pendientes

- `xcrun simctl list devices booted`: CoreSimulatorService connection invalid, Connection refused (61), runtimes/dispositivos no enumerables; log de CoreSimulator fuera del permiso de escritura. No hubo prueba en simulador o dispositivo.
- Intento de Metro local en 8081: el buscador de puertos terminó en `ERR_SOCKET_BAD_PORT`, 65536, al no poder abrir el servidor en este entorno. Se mantuvo la vista web existente en 5173 y se revisó el documento compacto compartido. No se presenta ese documento como una ejecución de la app.
- El sonido físico sigue pendiente. También la comprobación nativa de foco, controles, silencio del dispositivo, audio al pasar a segundo plano, memoria y rendimiento.
- Humo y paracaídas requieren escena diurna, plumas/deriva/descenso y revisión temporal propia. No se forzaron al cielo nocturno. Mines/comets no figuran como familias independientes en el inventario; las estrellas tipo comet revisadas pertenecen a la candle. Firecrackers excluidos de esta ampliación.
- [Pendientes nuevos](pending.csv), además de los [extractos y candidatos históricos](../playground-scenes-2026-09/pending.csv). Los finales no verificados continúan declarados como extractos. Ninguna muestra se promocionó a paquete completo.

Git: cambios propios y recursos de revisión, excluyendo PDFs locales del usuario, cachés, `artifacts/`, builds y exportaciones. Las ramas permanecen main. Commit/push autorizados, sin force push, despliegues ni publicaciones.
