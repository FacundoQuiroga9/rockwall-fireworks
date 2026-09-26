# Validación — 2026-09-26

Estado funcional y fuentes: [README](README.md). Esta revisión incluye el trabajo pendiente de catálogo, My List/PDF y Playground de las iteraciones anteriores. No se ejecutó un despliegue ni una publicación de la app.

## Comprobaciones automáticas

| Proyecto | Comando | Resultado |
| --- | --- | --- |
| Web | `npm run catalog:sync` | Aprobado; 302 identidades de imágenes, catálogo y módulos compartidos sincronizados. |
| Web | `npm run catalog:check` | Aprobado. |
| Web | `npm run lint` | Aprobado. |
| Web | `npm run test` | 119 pruebas aprobadas. |
| Web | `npm run build` | Aprobado; metadata de 303 rutas de catálogo. |
| App | `npm run typecheck` | Aprobado. |
| App | `npm run lint` | Aprobado. |
| App | `npm run test` | 39 pruebas aprobadas. |
| App | `npx expo export --platform all --output-dir dist-playground-continuity` | Exportaciones iOS, Android y web aprobadas. |

El build web conserva el aviso de tamaño del chunk diferido de miniaturas PDF (1.489,30 kB, gzip 742,50 kB). Los bundles de exportación y cachés quedan fuera de Git. Las pruebas incluyen catálogo, promociones, favoritos, My List y PDF existentes; los primeros cuatro perfiles conservan sus eventos originales.

Las pruebas nuevas comprueban identidad y parámetros de partículas nacidas antes de transiciones, etapas consecutivas y transiciones rápidas, límites de partículas, cese de emisión separado de la cola, pausa/continuación/reinicio, una sola voz de audio por fountain y liberación de recursos. También verifican geometría estable de bases, redondeo sólo de presentación, rutas de video por producto, ancla accesible y un único reproductor diferido. La app prueba las mismas invariantes en los módulos copiados por sync.

## Revisión en movimiento y navegación

- [Grabación WebM](review/fountain-transition-and-exhaustion.webm): 26,96 s, 1280 × 710, VP9, sin pista de audio. Fairies se reproduce en tiempo real de 16–24 s; un salto explícitamente rotulado adelanta a 57 s, y se observa hasta 76 s. No se acelera la transición ni el agotamiento. La última imagen muestra cero partículas y el envase estable: [cuadro final](review/recording-final-frame.png). Se verificó el archivo guardado reproduciéndolo en el navegador hasta su final, no sólo la sesión que lo generó.
- [Tres fountains](review/three-fountains-public.png): bases aprobadas, salidas alineadas, sombra y proporciones estables. [Fairies](review/fairies-public-base.png) y [comparación de bases](review/fountain-product-bases.png).
- Pausa/continuación mantuvo el tiempo 0:13; Restart regresó a 0:00. Retirar Super durante reproducción reconstruyó selección y dejó estado Ready, 0:00 y Sound off. Al desplazar el escenario fuera del viewport se verificó estado Paused. La limpieza de voces y partículas se cubre además por pruebas del ciclo de vida.
- Selección de American Anthem y tres fountains: filtro Cakes mantuvo las cuatro selecciones, un quinto producto quedó deshabilitado y Fountain field conservó Anthem seleccionado en el otro escenario. My List mantuvo sus cuatro unidades independientes.
- “Watch the reference” de Fairies navegó a `/products/fairies-in-a-jar#product-video`; foco en `video-title`, borde superior de sección 114,086 px frente a header 114,078 px. Cero iframes YouTube hasta Load video, uno después, sin autoplay. Se observó el video correcto de Spirit of ’76 pausado: [captura](review/embedded-reference.png). La acción repetida desde la ficha volvió al mismo destino. Jaws abrió su propia ficha/ancla: [medición](review/jaws-reference-route.json).
- Comparación visual de perfiles nuevos contra cuadros de referencia: [Jaws](review/jaws-render.png), [Anthem](review/anthem-render.png), [Flawless](review/flawless-render.png), [Ruckus](review/ruckus-render.png). Son aproximaciones ilustrativas; no se verifica escala física.
- Copia comercial sin notas de investigación: [Bump Bear](review/bump-bear-commercial-copy.png), “Approx. 24 sec · 16 shots”. Los extractos muestran Preview; tiempos precisos permanecen en perfiles.
- Alternativa para navegador de [teléfono](review/phone-alternative.png) (390 × 844) y [tablet](review/tablet-alternative.png) (1024 × 768), activada con el selector de dispositivo de desarrollo: cero canvas/iframes. No se afirma que esto sea una prueba con hardware móvil.
- Documento compacto del motor con movimiento reducido: inició pausado, controles Play animation / Still moment y sonido apagado; se revisaron [vertical](review/compact-reduced-motion-browser.png) y [horizontal](review/compact-landscape-browser.png). Fue Chrome, no WebView nativo.

## Rendimiento medido

Chrome 153 en macOS 26.5.2, viewport de dibujo 1280 × 640 CSS px, DPR del entorno 2, ocho procesadores lógicos reportados por el navegador. El renderer limita DPR a 1,5 (high) / 1,25 (compact). No se determinó el modelo físico de CPU/GPU. Los tiempos son coste de dibujo JavaScript medido con `performance.now()`, no tiempo total del compositor ni medición de batería.

| Fixture | Calidad | Ventana | FPS | Dibujo medio / p95 / máximo | Máximo de partículas dibujadas |
| --- | --- | --- | --- | --- | --- |
| Fairies, transición y final | High | 27 s | 60,0 | 0,824 / 1,5 / 6,9 ms | 465 |
| Cuatro fountains | High | 10 s | 60,1 | 0,883 / 1,5 / 2,5 ms | 797 |
| Cuatro fountains | Balanced compacto, límite 30 FPS | 10,02 s | 29,2 | 0,954 / 1,8 / 2,7 ms | 420 |
| Cuatro cakes densas, fixture sintético | High | 10 s | 60,1 | 0,216 / 0,7 / 1,8 ms | 1.000 |

Datos completos: `review/performance-*.json`. La prueba terrestre duplica Fairies para llegar a cuatro fountains; el catálogo real tiene tres. La prueba densa concentra eventos de cuatro copias de Band of Brothers para tensionar el presupuesto, sin modificar perfiles comerciales. Su ventana incluye cuadros quietos después del burst; por eso su media no representa coste sostenido de cuatro cakes. Ninguna medición acredita rendimiento en teléfonos o tablets físicos.

Reproducir fixtures sólo en desarrollo: `/scripts/playground/continuity-review.html` y `/scripts/playground/compact-review.html`. El grabador solicita explícitamente cada frame del canvas y espera las fotografías antes de arrancar. No están importados en el build público.

## Bloqueo nativo y pendientes

No se ejecutó la app nativa. `xcrun simctl list devices booted` falló por conexión inválida a CoreSimulatorService: registro de CoreSimulator con “Operation not permitted”, `simdiskimaged` código 53 y conexión rechazada código 61. Las exportaciones prueban generación de bundles; el fixture de Chrome sólo prueba el motor compartido. La revisión anterior también había encontrado EPERM al abrir el puerto de Metro.

Pendientes reales: ejecución iOS/Android, GPU/batería, VoiceOver/TalkBack, tacto, giro/safe areas, audio audible e interrupciones, background/regreso y compartir PDF en dispositivo. El audio sintetizado y su limpieza están probados con un contexto simulado, no comparados auditivamente con la grabación original.

En evidencia de producto siguen pendientes el final real de Jumboshell y Super, aperturas no resueltas de Daffodil/Ghost Dragon/Anthem y análisis de cargas múltiples de Full Speed. No se presentan esos extractos como secuencias completas.

## Versionado

Se revisan los diffs y se incluyen código, fuentes, recursos aprobados, pruebas y evidencia/documentación de las iteraciones de Rockwall pendientes. Se excluyen builds, cachés y descargas temporales de la raíz, preservando los dos PDF de My List del usuario. Destino autorizado: `main` de ambos remotos `origin`, sin force push ni reescritura. Los hashes y la confirmación efectiva del push se entregan en el mensaje final, una vez verificados contra el remoto.
