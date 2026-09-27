# Validación — iteración iniciada el 26 y cerrada el 27 de septiembre de 2026

## Comprobaciones automatizadas

- Web: `npm run catalog:sync`, `catalog:check`, `lint`, `test` (**146/146**) y `build`: PASS. Build genera metadatos de 303 rutas. Permanece la advertencia previa del chunk de miniaturas PDF, 1,489 MB; no se modificó ese subsistema.
- App: `npm run typecheck`, `lint`, `test` (**63/63**): PASS. `npx expo export --platform all --output-dir /private/tmp/rockwall-depth-export`: PASS para iOS, Android y web, 16 rutas web estáticas. No se publicaron estos bundles. Advertencias existentes de módulos JS sin `type:module` en tests y NO_COLOR/FORCE_COLOR en Metro.
- `tests/playground-depth.test.mjs`, idéntico en ambos proyectos: seis variantes de Nishiki; primer Play una vez; pulsaciones rápidas; pausa sin consumo; reinicio individual/global; tres cakes independientes; lanzamiento tras su final; dos bancos y cantidades desconocidas; doble break con un lanzamiento/contador; cola de duración propia; identidad/paleta entre calidades; fases finales de fountains y rechazo de bancos inválidos.
- Las pruebas de catálogo comparan productos reales web/app y recursos; sync/check compara bytes de perfiles y código compartido. Las pruebas previas mantienen alias, promoción explícita, listas/favoritos, PDF, selección por escenario, límite cuatro, audio y calidad adaptable. Las seis modificaciones comerciales son exclusivamente enriquecimientos de demostración: no cambian IDs, slugs, categorías ni reglas promocionales.

## Revisión visual y grabaciones

Documento de producción real, creado por `buildPlaygroundDocument`; `scripts/playground/depth-review.html` sólo elige los productos y expone mensajes de métricas. No usa un segundo renderer. Las capturas de Chrome se codificaron con `manual-screen-review.html?capture=depth` y `?capture=depth-mixed`, conservando sus intervalos; sin interpolar imágenes ni reconstruir interacciones. El ajuste CSS del fixture permite encuadrar el documento completo sin cambiar su cámara interna.

- [Nishiki y Dallas](nishiki-dallas.webm): 413 capturas, aproximadamente 36,5 s. Primer disparo automático, cinco pulsaciones manuales, seis efectos distintos, final en `waiting` con 6/6 y sin partículas. Controles reales; sonido silenciado. Las tomas descartadas por recarga de Vite no se entregan.
- [Tres cakes y Nishiki](three-cakes-nishiki.webm): 1138 capturas, 42,76 s. Bump Bear, Band of Brothers y Raging Willow continúan mientras se lanzan muestras de Nishiki. El sexto lanzamiento ocurre después de terminar las cakes; no reinicia sus secuencias. [Estado final](mixed-runtime.json).
- Revisados Double Dragon y sus dos aperturas por unidad, Ghostacular ampliado, Raging Willow en la combinación, ambas fountains nuevas, etapas bajas reales, fotografías estables y agotamiento. [Bases](fountain-bases.png), [Double Dragon](double-dragon.png).
- En Dallas el lanzamiento emerge por encima de la silueta, la caída desaparece detrás de las torres y sigue en huecos abiertos. [Imagen de oclusión](dallas-occlusion.png), [verde](nishiki-green.png), [azul](nishiki-blue.png). [Muestreo de píxeles](occlusion-pixels.json) complementa la revisión: 42.932 píxeles interiores por muestra; pequeñas diferencias de rasterización de hasta 12/255 cerca del contorno, sin la estela luminosa pintada sobre la fachada; los huecos conservan la caída visible. No se usa una banda rectangular.
- Revisiones compactas a 390×760 y horizontal 844×560 CSS, y escenario ancho 1920×620. Es el documento compartido ejecutado en Chrome, **no prueba de la app nativa**. Movimiento reducido conserva un momento estático y requiere Play animation explícito. El riel de una sola selección aprovecha su ancho disponible. Botones nativos con foco visible, nombre accesible del siguiente efecto y Enter para activar Play.

Evidencia de encuadres: [compacto vertical](compact-portrait.png), [horizontal](compact-landscape.png) y [panorámico](dallas-wide.png). [Galería de entrega](review.html).

Las grabaciones se hicieron a viewport 1440×722; la página de revisión muestra el documento 1310×820 escalado para que quepa entero. La captura añade trabajo al navegador, por eso se separa de la batería de rendimiento. El sonido silenciado de estos videos no demuestra un fallo de audio ni audibilidad física; no incluyen audio de YouTube.

## Rendimiento medido

Chrome **153** en macOS, DPR 2, ocho procesadores lógicos reportados. CPU/RAM físicas no disponibles por permisos de `sysctl`; el UA de compatibilidad no identifica el modelo de Mac. Batería de cinco tramos de **35 s**, más 1,3 s de asentamiento por tramo, sin grabación de pantalla simultánea ni prueba ilimitada. Canvas 1280×640 CSS (borde incluido en `getBoundingClientRect`, backing 2564×1284). [Datos completos](performance-suite.json), reproducibles con `scripts/playground/controls-review.html?depth`.

| Cuatro productos | Solicitada / efectiva | FPS dibujados | Dibujo medio / p95 (ms) | Pico de partículas / puntos |
| --- | --- | ---: | --- | --- |
| Tres cakes + Nishiki manual | Auto / High | 58,14 | 1,507 / 3,20 | 459 / 1516 |
| Tres cakes + Nishiki manual | High / High | 57,71 | 0,510 / 0,80 | 459 / 1516 |
| Fairies, Movie Time, Citrus, Snow Cone | Auto / High | 56,83 | 2,165 / 2,40 | 1414 / 2523 |
| Mismas cuatro fountains | High / High | 57,05 | 1,927 / 2,40 | 1414 / 2523 |
| Nishiki, Double Dragon, Ghostacular, Maelstrom repetidos | High / High | 56,54 | 0,521 / 1,00 | 475 / 1471 |

No hubo intervalos dibujados >50 ms ni reducción automática en esta batería. Los contadores finales de los cuatro shells fueron **6, 6, 10, 8**, respetando límites y bancos independientes. Auto y High llegaron al mismo nivel efectivo: las diferencias de tiempo entre esos ensayos no significan una diferencia de calidad visual. Los picos se miden en cada cuadro, no son partículas por explosión. Los puntos incluyen estelas; no todos representan partículas independientes. Heap JS máximo por tramo aproximadamente **31–35 MB**, sin representar toda la memoria GPU/proceso ni demostrar ausencia universal de fugas.

Composición completa con skyline: [cuatro aéreos High](dense-high-runtime.json), pico muestreado 459 partículas/1342 puntos, último tramo de 15,2 s después del lanzamiento manual a 58,9 FPS, media 1,19 ms y máximo de dibujo 14,9 ms. El contador temporal de métricas se reinicia al disparar manualmente; no se presenta ese promedio como el total de la sesión. Las métricas del fixture se reciben cada 300 ms: sus picos son muestreados, a diferencia de la batería anterior.

Documento completo con cuatro fountains Auto: [84,6 s](four-fountains-runtime.json), 58,7 FPS, 4,88 ms de media, máximo aislado 49,8 ms; pico muestreado 1384 partículas/2480 puntos. Incluye capturas puntuales y una revisión del tramo final; no es una comparación controlada contra el benchmark sin interfaz. Termina con cero partículas/puntos/voces. El primer registro de `qualityChanges` del fixture puede conservar un mensaje tardío del documento anterior al reconstruir el iframe; no representa un salto de tiempo de reproducción.

Se conservan presupuestos globales de puntos: escritorio **650/1400/3200**, compacto **350/700/1600** para Low/Balanced/High; DPR máximo **1/1,5/2** y **1/1,25/1,75**, tope **4M/2M píxeles**. Transición de detalle de 1,2 s, reducción sostenida y recuperación gradual existentes. No se vacían partículas por calidad. Colores, banco y tiempos están separados del controlador de detalle. Adaptación forzada cubierta por tests; no se afirma que este equipo haya necesitado reducirse con estos perfiles.

## Limitaciones concretas

- Native: `simctl list devices available` llegó a listar iPhone 17 Pro/iOS 26.4 y `simctl boot` devolvió éxito. La consulta posterior `simctl listapps` falló: **CoreSimulatorService connection invalid / Connection refused (61)**, servicio de imágenes de runtime código 410 y log fuera del permiso de escritura. El intento de acceder a Simulator por Computer Use fue rechazado por autorización de esa aplicación. No se completó arranque/verificación de Rockwall dentro del simulador. Pendientes: oclusión SVG en WKWebView/Android WebView reales, controles táctiles, audio/dispositivo, segundo plano y rendimiento/memoria nativos.
- Salida acústica física no confirmada. Se conserva WebAudio sintetizado y su estado real; los tests cubren eventos y limpieza, no equivalen a escuchar un parlante. La comprobación digital de la iteración anterior continúa documentada por separado.
- Faltan variantes restantes de Ghostacular y muestras adicionales de otros bancos antiguos. No se convierten cinco bancos de una muestra en paquetes completos. Movie Time y Super Fountain conservan cierre de simulación. Neon Boom queda pendiente de separar mines y aperturas; no se publica una secuencia inventada.
- Se liberaron únicamente capturas temporales descartadas de esta iteración después de un error ENOSPC. Se conservaron los tres PDFs locales ajenos; ni estos, ni cachés, builds o exportaciones entran en Git.

Git se entrega en `main` de ambos repositorios, con commits descriptivos y push normal. Los identificadores y el resultado efectivo de cada push se informan al finalizar, sin despliegue ni publicación de app.
