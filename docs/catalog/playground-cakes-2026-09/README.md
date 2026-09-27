# Ascensos, selector horizontal y cobertura de cakes — 2026-09-27

Continuación de [la navegación por escenario](../playground-navigation-2026-09/README.md). **302 productos, 45 perfiles; 117 IDs de cakes conciliados. No están completas todas las cakes.** No despliegue ni publicación. Revisión visual nativa **pospuesta por decisión del usuario**; no Simulator, Metro, dispositivos ni exportaciones.

## Corrección del motor

La causa principal era `launchVisible`: el renderer omitía por completo el ascenso cuando la estela no había podido verificarse. Además, los ascensos se dibujaban después de partículas anteriores en la misma cuota, con un punto pequeño y opaco; una apertura densa podía consumir ese presupuesto. La geometría anterior empezaba a 83% de altura, dentro de la composición de ciudad, y la cola tenía su propia fórmula lineal.

`playgroundFlight` define ahora una trayectoria continua desde el origen de cada producto, a 96% de altura, hasta el centro exacto de su apertura. `event.x/y` siguen definiendo el destino; `launchX` permite un origen explícito. Sin él, cada producto conserva un origen fijo: las aperturas desplazadas se conectan mediante una trayectoria inclinada. Posiciones, alturas y proyección siguen siendo aproximaciones de visualización, no distancias físicas ni una nueva afirmación comercial sobre abanicos.

Los proyectiles esenciales se dibujan primero dentro de cada cuota, a un tamaño mínimo legible, en Low/Balanced/High. Cuando no hay estela verificada se usa un punto discreto sin una cola vistosa. Las estelas documentadas toman muestras de la misma trayectoria. No se mueve ningún tiempo de lanzamiento o apertura de los perfiles previos; los dos cues de audio siguen sus propios tiempos. `launchCue:false` impide un ascenso adicional en los breaks secundarios de un shell. Pausa, calidad y reinicio no alteran la identidad ni el orden de las variantes.

Se conserva el alfa real de Dallas y el orden cielo → efectos → ciudad → controles. No se añade una máscara rectangular ni un brillo sobre las fachadas. La cámara terrestre, las fotografías de fountains y su agotamiento permanecen intactos. [Auditoría de ascensos](flight-audit.json) registra los puntos ilustrativos y los intervalos muy breves heredados: no se alargan para inventar ritmo. Un primer ascenso recortado por la fuente sigue siendo breve.

Los perfiles nuevos requieren dos componentes opcionales acotados: perspectiva elíptica de anillos y grupos de chispas descendentes de un mismo break (máximo 48). Wild West utiliza cinco cometas giratorios con un pequeño report explícito, sin convertirlos en explosiones esféricas ni ampliar la familia pública de spinners. No hay nuevos emisores acumulativos. Los valores por defecto preservan los efectos anteriores.

## Una fila por escenario

Web: tarjetas 166×226 px, imágenes con espacio reservado, nombre de dos líneas, scroll horizontal nativo sin snap ni avance automático. Flechas de 44 px y fades discretos indican los extremos. Arrastre de mouse después de 7 px, con supresión del clic de ese gesto; teclado y clic normal siguen seleccionando. Arrow Left/Right/Home/End recorren la fila y mantienen visible el foco; los atajos modificados del navegador no se interceptan. Las acciones secundarias permanecen fuera de las tarjetas.

App: ScrollView horizontal táctil, tarjetas 164×220 px, dirección bloqueada durante el gesto y tamaños estables. Sin inspección visual nativa. El scroll de cada fila se restablece al cambiar escena/filtro/búsqueda, no al seleccionar. No se añaden videos a tarjetas. Los tres catálogos siguen separados: Dallas 25 cakes + 11 shells; Close-up seis fountains sin filtro redundante; Open Field tres muestras existentes. Límite de cuatro, selecciones recordadas, favoritos, My List, promociones, PDF y accesos al video incrustado permanecen.

## Tanda publicada

Diez altas: **dos secuencias completas y ocho extractos**. Strobing Willow pasa de cinco a veinte aperturas resueltas y continúa como extracto. Ningún banco de shells cambia su contenido.

| ID / producto | Modelo | Aperturas publicadas / dato comercial | Ventana absoluta | Alcance / texto público |
|---|---|---|---|---|
| `whacky-tobacky` · Whacky Tobacky | Brothers BP2501 | 8 / 9 shots | [Video](https://www.youtube.com/watch?v=kfKXaQZ-2rk) · 5.6–31.5 s | Preview · Approx. 26 sec |
| `magnum-tremors` · Magnum Tremors | Raccoon RA57206 | 8 / 9 shots | [Video](https://www.youtube.com/watch?v=VihP3cMcJi4) · 6.5–37.9 s | Preview · Approx. 31 sec |
| `migraine` · Migraine | Raccoon RA57207 | 6 / 9 shots | [Video](https://www.youtube.com/watch?v=ElEOhs6JI0U) · 7.4–32.4 s | Preview · Approx. 25 sec |
| `neon-jellyfish` · Neon Jellyfish | Raccoon RA57212 | 7 / 9 shots | [Video](https://www.youtube.com/watch?v=UG_3QDM9310) · 6.2–35.4 s | Preview · Approx. 29 sec |
| `sky-ink` · Sky Ink | Black Cat BC6530 | 16 / 16 shots | [Video](https://www.youtube.com/watch?v=mFICypgeVm8) · 1.95–26.4 s | Full sequence · Approx. 24 sec |
| `wild-horses` · Wild Horses | Raccoon RA22002 | 18 / 25 shots | [Video](https://www.youtube.com/watch?v=w5QUlnKoDnA) · 7.2–35.5 s | Preview · Approx. 28 sec |
| `pyro-pilot` · Pyro Pilot | Winda P5182 | 5 / 25 shots | [Video](https://www.youtube.com/watch?v=zQST3i4YhlY&pp=ygUQcHlybyBwaWxvdCB3aW5kYQ%3D%3D) · 4.25–12.4 s | Preview · Approx. 8 sec |
| `wild-west` · Wild West | Brothers BP2924 | 25 / 25 shots | [Video](https://www.youtube.com/watch?v=RbwodLEP4lw) · 5.15–31.3 s | Full sequence · Approx. 26 sec |
| `nation-ovation` · Nation Ovation | Winda P5184 | 13 / 16 shots | [Video](https://www.youtube.com/watch?v=EeZPscToUz0&pp=ygUUbmF0aW9uIG92YXRpb24gd2luZGE%3D) · 6.05–31.45 s | Preview · Approx. 25 sec |
| `dreams-from-heaven` · Dreams from Heaven | Raccoon RA22010 | 18 / 25 shots | [Video](https://www.youtube.com/watch?v=ro7nIqMhvx0) · 4.65–30.15 s | Preview · Approx. 26 sec |

Los conteos comerciales no rellenan aperturas ausentes. Whacky Tobacky y Magnum Tremors tienen rótulo de nueve shots, pero sólo ocho centros se resuelven. Migraine/Neon Jellyfish/Wild Horses/Nation Ovation/Dreams from Heaven terminan antes de finales superpuestos pendientes. Pyro Pilot publica sus cinco primeras aperturas; sus componentes posteriores necesitan más revisión. Las colas de cierre de un extracto se ajustan dentro de esa ventana y no verifican el final físico del producto. Sky Ink sí tiene doce aperturas individuales y cuatro centros finales; Wild West tiene cinco grupos de cinco y una cola visible antes del outro.

[Observaciones](observations.json) conserva tiempos absolutos, colores, scope, límites, edición observada y notas de identidad. [Fuentes del fabricante](manufacturer-sources.json) complementa los videos reales, no reemplaza su análisis. Se revisaron también Canopus, Avalanche, Ghost Rings, Hot as Hell, Pirate Captain, Call the Cops y Fun Fuel; sus motivos concretos están en pendientes. No se redistribuye audio de YouTube. Fotografías aprobadas ya existentes, sin envases generados.

El overlay [catalog-enrichment.json](catalog-enrichment.json), protegido por ID/URL, persiste con `catalog:sync`. Ejemplos: Sky Ink “Warm gold branches carry red and white glitter, followed by red and silver plum blossoms”; Wild West “Red bouquets, bright white stars and blue pearls lead into twisting multicolor tails with sharp reports”. La evidencia queda interna; no vuelve “Observed in the video” a las fichas. El redondeo sólo afecta presentación, no eventos.

## Cobertura real

| Estado del inventario cake | IDs |
|---|---:|
| Secuencias completas | 8 |
| Extractos publicados, aún pendientes de completar | 17 |
| Sin perfil: referencia enlazada aún sin análisis suficiente | 74 |
| Sin perfil: video revisado, secuencia/cortes/componentes pendientes | 7 |
| Bloqueo de identidad comprobado | 2 |
| Presentación diurna o híbrida que requiere tratamiento propio | 4 |
| Packs de varias cakes | 5 |
| Total | 117 |

**92 IDs no tienen perfil**, incluidos los casos especiales y bloqueados. No se afirma que los 74 sin análisis carezcan de evidencia; esta iteración no termina su investigación. [Lista concreta por ID, motivo y enlace](PENDING.md), [JSON](cake-coverage.json), [CSV](cake-coverage.csv). Hot as Hell muestra RA57218 en la referencia y RA57216 en catálogo; Absolute Pyro carece de marca reconciliada. Los gramajes no se utilizaron para bloquear una identidad ya verificada.

Total Playground: **45 perfiles = 12 secuencias completas + 19 extractos + 14 muestras**. Por familia: 25 cakes (8 completas/17 extractos), 11 bancos de shells, 6 fountains (4 completas/2 extractos), Roman candle/spinner/rocket existentes (una muestra cada uno). Cantidad de perfiles, efectos de un banco y breaks no son cantidades de unidades comerciales.

## Validación

Web: `catalog:sync`, `catalog:check`, lint, 162 pruebas y build. App: TypeScript, lint, 69 pruebas. Paridad exacta de perfiles/índice/motor/runtime generado. Las pruebas conservan los 35 perfiles anteriores salvo la ampliación documentada de Strobing Willow, cuyo prefijo de cinco eventos es idéntico. Verifican continuidad geométrica en tres tamaños, un único ascenso multibreak, prioridad de cuatro cabezas bajo presupuesto, pausa/reinicio y ritmo de cakes independiente de disparos manuales.

En Chrome se reprodujo cada nueva ventana hasta su final, más Strobing Willow ampliada. Se inspeccionaron diferencias de anillos, palmas, flores y colas frente a los fotogramas de referencia. El desplazamiento/teclado de la fila, filtros y estados por escenario se revisaron en la interfaz pública. Las pasadas que sufrieron recargas de Vite se repitieron en una página estática local que utiliza el mismo documento de producción; no se contaron como validadas. Se redujeron sólo capturas temporales propias tras un error de espacio. Ninguna de estas revisiones equivale a una prueba nativa.

[Grabación de 33 segundos](evidence/launches-and-manual-shells.webm): tres cakes y cuatro variantes de Nishiki, incluida una después del final automático. 107 capturas consecutivas (~3,2 imágenes/s) codificadas a su tiempo original, sin acelerar; no representan la tasa de cuadros del motor. Video silencioso. Se ve el ascenso, la apertura, la caída detrás de Dallas y el contador independiente. El último cuadro de la versión final registra **cero partículas y cero voces**. La tolerancia de 1 ns en el límite de vida elimina un residuo de coma flotante al desplazar tiempos manuales; se prueba para todos los bancos.

[Los tres selectores](evidence/three-horizontal-selectors.jpg), [Dallas](evidence/dallas-selector.jpg), [Close-up](evidence/close-up-selector.jpg), [Open Field](evidence/open-field-selector.jpg). Recortes de capturas reales de la interfaz, sin recrear contenido. [Referencias con marcas de tiempo](evidence/reference-overview.jpg) y hojas de revisión por producto dentro de evidence. La página no presenta overflow horizontal: sólo la fila se desplaza. El arrastre de 430 px no cambió selección y un clic posterior sí; End llevó al último producto con foco visible. Los tres escenarios conservaron sus propias selecciones y conteos.

### Rendimiento y sonido

[Mediciones completas](evidence/performance.json): Chrome 153 en macOS, DPR 2, ocho procesadores lógicos expuestos, equipo físico no identificado. Canvas CSS 1280×640; buffer High 2564×1284 y Balanced 1923×963. Pasadas acotadas de 35 s, sin grabación simultánea, motor/timeline/controlador de calidad reales. CPU de Canvas y heap JS, no GPU/batería/nativo.

| Carga | Calidad solicitada / efectiva | FPS dibujados | CPU media / p95 | Pico de partículas activas / puntos | Heap pico |
|---|---|---:|---|---:|---:|
| Whacky + Magnum + Migraine + Neon | Auto / High | 59,94 | 1,066 / 1,9 ms | 174 / 1.142 | 28,9 MB |
| Mismos cuatro | High / High | 59,80 | 1,074 / 1,9 ms | 174 / 1.142 | 24,6 MB |
| Mismos cuatro | Balanced / Balanced | 59,83 | 0,852 / 1,7 ms | 109 / 677 | 24,4 MB |
| Sky Ink + Wild West + Wild Horses + Nishiki manual repetido | High / High | 59,57 | 1,399 / 2,6 ms | 1.248 / 1.499 | 25,4 MB |

P95 entre cuadros 17,3–17,5 ms. La mezcla manual tuvo un intervalo >50 ms y un máximo de dibujo de 46,8 ms; las otras tres pasadas no tuvieron intervalos >50 ms. No hubo cambios de calidad sostenidos. Presupuestos existentes: High 3.200, Balanced 1.400 puntos; ninguno se superó. Estas medidas preceden únicamente al ajuste numérico del instante terminal manual; las pruebas y grabación posteriores verifican su limpieza. No equivalen a rendimiento nativo.

[Audio digital](evidence/audio-metrics.json): contexto running por interacción explícita, volumen 0,35, pico 0,304, RMS máximo 0,148, máximo ocho voces y RMS final cero. La grabación de la combinación registra audio activado y sus eventos manuales; **la salida física audible no fue verificada**. No se atribuye al dispositivo lo que sólo demuestra generación de señal. Los archivos de captura completos y los bundles locales de revisión quedan en rutas temporales/`artifacts`, ignorados por Git. Se versionan únicamente muestras compactas, fuentes, métricas y scripts reproducibles.

## Continuación y reproducción

1. Priorizar los 74 IDs sin análisis y resolver los siete videos ya revisados antes de dar por terminada la cobertura. Revisar cada variante y ventana, no extrapolar shots desde el envase.
2. Perfiles en `src/data/playgroundProfiles.json`, índice y overlay de esta carpeta. Mantener `scene`, ventanas precisas, scope y notas internas. No asignar una secuencia artificial a packs.
3. `npm run catalog:sync` genera app, productos, índice y el runtime offline, incluido `aerialFlight`; no editar copias generadas.
4. `node scripts/playground/cakes-review-static.mjs` genera `/artifacts/cakes-review.html` en el Vite local sin HMR. La galería versionada `/scripts/playground/cakes-review.html` usa el mismo documento. `controls-review.html?cakes` ejecuta pasadas acotadas de 35 s por calidad y la mezcla manual.
5. Ejecutar comandos requeridos y revisar movimiento antes de cambiar un extracto a completo. La revisión visual nativa sigue pospuesta por decisión del usuario.

Vista previa local: <http://localhost:5173/playground>. No despliegue ni publicación. Los PDF preexistentes de My List no forman parte de estos cambios.
