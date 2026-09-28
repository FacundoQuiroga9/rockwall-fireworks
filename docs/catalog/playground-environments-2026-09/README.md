# Entornos, selector simple y seis cakes — 2026-09-27

> Continuación actual: [auditoría de fidelidad y duraciones](../playground-fidelity-2026-09/README.md). Las duraciones y coberturas de esta página describen el estado anterior a esa auditoría.

Continuación de [ascensos y cobertura de cakes](../playground-cakes-2026-09/README.md). **302 productos, 51 perfiles; 117 IDs de cakes conciliados. Las cakes todavía no están completas.** No despliegue ni publicación. La revisión visual nativa está **pospuesta por decisión del usuario**: no se abrió Simulator, Metro ni dispositivos, ni se generaron exportaciones de rutina.

## Presentación y memoria

Los botones muestran únicamente Dallas Sky, Open Field y Close-up, con su estado activo accesible. Se quitaron los conteos de picks guardados, el contador de cabecera y los avisos automáticos de selecciones guardadas. Una frase breve mantiene el límite de cuatro; al intentar agregar un quinto se explica que debe quitarse uno. Las tarjetas y el resumen conservan su selección. Las tarjetas siguen accesibles al llegar a cuatro: el intento de agregar otra muestra el aviso y no cambia la selección; ya no se declaran deshabilitadas para impedir esa explicación a teclado/lector de pantalla. Clear active selection sólo limpia la escena actual. La memoria por escenario, los filtros/búsquedas aislados, My List, favoritos, PDF, promociones y contadores de shells siguen independientes.

La distribución no cambia: Dallas contiene 31 cakes y 11 bancos de shells; Close-up contiene seis fountains; Open Field conserva Ladybugs (Brothers), 10 Ball Roman Candle (Monkey Mania) y Skybolt (Brothers). No se publican nuevas familias ni se reclasifican productos por su nombre.

## Dos ambientes generados e integrados

Se generaron dos placas fotográficas con la herramienta integrada **image_gen**. [Prompts exactos](generation-prompts.json), [dimensiones, bytes y hashes](assets.json). Originales de 1774×887; se versionan los WebP optimizados, no los PNG de trabajo. Sólo se aplicó compresión/redimensionado después de generar: no se inventaron envases ni se retocaron fotografías de productos.

- **Close-up:** una amplia superficie firme de hormigón, textura y juntas en perspectiva; casas estadounidenses y árboles pequeños a distancia; cielo de última hora del día. La zona de apoyo está a 87% de altura y el cielo queda despejado para la fuente. Las casas aportan contexto lejano, sin personas, vehículos ni objetos junto a las chispas.
- **Open Field:** explanada abierta, plataforma mineral/hormigón en primer plano, campo y arbolado remoto. Horizonte bajo, mayor distancia y una luz azul diferente a la calidez del barrio. No es un degradado ni una textura repetida.

Investigación previa: [Black Cat, contexto y separación del entorno](https://blackcatfireworks.com/how-shop-for-backyard-fireworks-show/), [CPSC](https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Fireworks), [superficie firme y entorno despejado](https://www.firework-mania.com/fireworks-safety/), [Brothers Ladybugs, variante voladora](https://twistedthunder.com/shop/brand/brothers/lady-bugs/) y [Winda Snow Cone](https://www.getwinda.com/product-page/snow-cone-m). Estas fuentes orientan una **composición ficticia**, no prueban que un barrio, parque o sitio concreto autorice el uso de fuegos artificiales. No se agregan instrucciones de encendido ni de carga a la interfaz.

`playgroundEnvironments.json` configura los recursos por escena, separado de los perfiles. La web solicita sólo la placa activa: Close-up 117.342 bytes, Open Field 72.882 bytes. El WebView recibe sólo la placa compacta seleccionada: 52.680 y 33.416 bytes, respectivamente; ambas están incluidas en el bundle offline (aproximadamente 115 KB en base64 en conjunto). El recorte es `cover`, centrado y apoyado abajo; conserva suelo y cielo en encuadres estrechos sin alterar la cámara del efecto. La inspección de recorte realizada corresponde a web de escritorio; no es validación nativa.

El fondo es una imagen absoluta, bajo el Canvas, sin afectar altura/layout ni la posición de los productos. Sólo estos dos escenarios sustituyen sus estrellas/terreno anteriores. Las fotos aprobadas, dimensiones estables, puntos de emisión, sombras y luz discreta del envase permanecen. El renderer ahora solicita únicamente fotos de productos seleccionados y libera sus callbacks al destruirse. La app sincroniza recursos embebidos, perfiles, lógica y documento; no depende de archivos del repositorio web en ejecución.

**Dallas y el hero no cambian.** La prueba compara el SHA del marcado/CSS de Dallas anterior (normalizando sólo espacios entre etiquetas), las estrellas y los dos skylines aprobados. Cielo, colores, encuadre, máscara alfa, oclusión y orden de capas son idénticos. La única optimización compartida del renderer evita cargar fotos ajenas a la selección; no cambia sus operaciones de dibujo.

## Cakes publicadas

Seis altas, todas **extractos**, con 55 aperturas resueltas. Ningún perfil previo se modifica. No se convierte la longitud del video ni el conteo del envase en una secuencia inventada.

| ID / producto | Modelo | Aperturas publicadas / shots del envase | Ventana absoluta de referencia | Texto público |
|---|---|---:|---|---|
| `jawbreaker` · Jawbreaker | Raccoon RA22009 | 15 / 25 | [3,50–22,50 s](https://www.youtube.com/watch?v=Vm9Ug3rc84A) | Preview · Approx. 19 sec |
| `willow-explosion` · Willow Explosion | Raccoon RA53631 | 4 / 24 | [5,90–17,05 s](https://www.youtube.com/watch?v=AtqiNrQGq-0) | Preview · Approx. 11 sec |
| `old-ironsides` · Old Ironsides | Brothers BP2452 | 13 / 30 | [5,50–25,50 s](https://www.youtube.com/watch?v=3d8P_pGNLc4) | Preview · Approx. 20 sec |
| `color-rage` · Color Rage | Raccoon RA53072 | 4 / 30 | [5,55–15,50 s](https://www.youtube.com/watch?v=NvDuDojoKT4) | Preview · Approx. 10 sec |
| `aggression` · Aggression | Raccoon RA22007 | 5 / 25 | [6,80–13,60 s](https://www.youtube.com/watch?v=fLGTxYPM494) | Preview · Approx. 7 sec |
| `whisky-business` · Whisky Business | Bright Star BS8039 | 14 / 20 | [5,60–38,25 s](https://www.youtube.com/watch?v=SxzplhvlmUk) | Preview · Approx. 33 sec |

Se inspeccionaron los seis videos reales hasta su final, con capturas temporizadas y comparación alrededor de aperturas próximas. No se observó un cambio de velocidad ni otra zona de lanzamiento; la visibilidad no permite asegurar más que un origen aparente. Los intros, outros y cortes de cierre se registran por separado. [Observaciones por evento](observations.json), [fotogramas con tiempos](evidence/reference-overview.jpg), [comparación de las simulaciones](evidence/new-cakes-review.jpg).

Jawbreaker conserva tres fases distintas antes del tramo rojo/azul y del final superpuesto. Willow Explosion publica cuatro coronas Nishiki aisladas; la sección rápida posterior necesita separación de centros. Old Ironsides conserva las pausas entre tres bloques: azul/blanco, blanco y palmas doradas. Su gramaje continúa incierto en el catálogo; no se alteró categoría ni promoción para agregar el perfil.

Color Rage publica cuatro aperturas cromáticas y su componente posterior de brillo pálido. La atribución exacta de los destellos tardíos a disparos separados no está resuelta: no se agregaron lanzamientos basados en cada chispa. Aggression muestra cinco aperturas iniciales rojas/doradas; los cambios verde/teal y la zona final densa quedan pendientes. Whisky Business conserva catorce centros visibles, con palmas, puntos rojos/plata y hojas descendentes; faltan seis centros por resolver frente al rótulo de veinte. Aunque incluye la cola final visible, permanece como extracto con cobertura incompleta de eventos.

Los ascensos discretos o estelas visibles se conectan con la apertura sin cambiar su tiempo. Geometría, persistencia y audio sintetizado siguen siendo aproximaciones. El cierre suave de un extracto no verifica el final físico del producto. Los tiempos internos conservan decimales. El overlay [catalog-enrichment.json](catalog-enrichment.json) sobrevive a `catalog:sync`; la ficha presenta texto comercial en inglés, sin narrar la investigación. Ejemplo: “Golden tails rise into red-tipped palms and silver-speckled crowns, followed by broad willow trails and drifting red leaves.” La [ficha oficial BS8039](https://www.getwinda.com/product-page/whisky-business-20-s) confirma identidad y familias de efectos; el perfil utiliza sus tiempos observados, no la duración publicada como sustituto del análisis.

## Cobertura y pendientes

| Estado de cakes | IDs |
|---|---:|
| Secuencias completas | 8 |
| Extractos que todavía requieren completar la secuencia | 23 |
| Sin perfil, referencia enlazada pendiente de análisis | 68 |
| Sin perfil, referencia revisada con componentes/cortes pendientes | 7 |
| Identidad bloqueada | 2 |
| Presentación diurna o híbrida | 4 |
| Packs de varias cakes | 5 |
| **Total** | **117** |

**86 cakes siguen sin perfil.** No se afirma que carezcan de demostración ni que el trabajo esté terminado. [Lista completa por ID, motivo y fuente](PENDING.md), [conciliación JSON](cake-coverage.json). Los motivos anteriores se mantienen y `reviewedThisIteration` identifica únicamente los seis videos revisados aquí. Hot as Hell conserva el conflicto de código RA57218/RA57216; Absolute Pyro, su identidad pendiente. No se bloquearon nuevas publicaciones por gramaje.

Total Playground: **51 perfiles = 12 secuencias completas + 25 extractos + 14 muestras**. Por familia: 31 cakes (8/23), seis fountains (4/2), once bancos de shells y tres muestras existentes de Open Field. Efectos de un banco, breaks y unidades del paquete siguen separados.

## Validación y reproducción

Web: `catalog:sync`, `catalog:check`, lint, **167 pruebas** y build. App: TypeScript, lint y **71 pruebas**. Paridad exacta de productos, perfiles, índice y módulos compartidos. Las nuevas pruebas verifican carga de un único paisaje, fotos sólo de la selección, limpieza de callbacks, conservación de Dallas, memoria sin mensajes redundantes, rechazo del quinto, cobertura por ID, recursos compactos offline y preservación de los 45 perfiles aprobados. El build mantiene la advertencia conocida sobre el chunk grande de miniaturas PDF; no es un nuevo recurso de escenarios.

Cada extracto nuevo recorrió su ventana completa en Chrome de escritorio y terminó con cero partículas. [Registro del runtime](evidence/visual-review.json). Se compararon colores, agrupaciones y caída con las capturas de referencia. Algunas capturas rápidas devolvieron la capa de iframe vacía sin error de consola; se descartaron como fallos de captura y las láminas usan capturas válidas cercanas con su tiempo real impreso. No se reconstruyó artificialmente el contenido.

La galería `node scripts/playground/environments-review-static.mjs` genera `/artifacts/environments-review.html` usando el documento de producción sin recarga en caliente. El benchmark acotado está en `scripts/playground/environments-performance.*`; se mide sin grabación simultánea. Los artefactos temporales y videos de referencia no se versionan; sólo evidencia compacta. No se copió audio de YouTube, no se cambió el sintetizador y esta revisión no afirma comprobar salida física audible.

Vista previa: <http://localhost:5173/playground>. Las validaciones visuales y de rendimiento son web de escritorio; **la revisión visual de la app permanece pospuesta por decisión del usuario**.

### Rendimiento medido

[Datos completos](evidence/performance.json): Chrome 153/macOS, DPR 2, ocho procesadores lógicos expuestos; modelo físico no identificado. Canvas CSS 1280×640, buffer 2560×1280. Cuatro pasadas de 35 segundos, sin grabación simultánea. Se mide CPU del renderer, intervalos entre cuadros y heap JS; no memoria GPU, temperatura ni rendimiento nativo. Cakes: Jawbreaker, Willow Explosion, Old Ironsides y Whisky Business. Fuentes: Fairies in a Jar, Jumboshell Fountain, Super Fountain y Movie Time, tramo continuo de 15–50 s, con paisaje y fotos cargados.

| Carga | Solicitada / efectiva | FPS | CPU media / p95 | Pico partículas / puntos | Heap pico |
|---|---|---:|---|---:|---:|
| Cuatro cakes nuevas | Auto / High | 60,00 | 1,25 / 2,30 ms | 305 / 1.183 | 43,0 MB |
| Mismas cakes | High / High | 60,03 | 1,23 / 2,30 ms | 305 / 1.183 | 27,6 MB |
| Cuatro fountains + Close-up | Auto / High | 59,74 | 6,42 / 8,10 ms | 1.545 / 2.755 | 34,6 MB |
| Mismas fountains + Close-up | High / High | 59,80 | 6,41 / 8,00 ms | 1.545 / 2.755 | 36,1 MB |

P95 entre cuadros 17,9–18,3 ms. Una separación >50 ms en fountains/Auto, ninguna en las otras tres pasadas; máximo CPU 44,4 ms en esa pasada. Sin reducción sostenida de calidad, sin superar el presupuesto High de 3.200 puntos. La prueba del documento completo con cuatro fuentes también se registró [por separado](evidence/four-fountains-runtime.json); incluye el paisaje real integrado, pero su FPS se ve afectado por capturas y otras tareas, por lo que no sustituye las pasadas dedicadas.

Las dos placas web suman 190.224 bytes en disco, pero no se solicitan juntas. Sus píxeles decodificados ocupan aproximadamente 6,3 MB por placa de 1774×887; la compacta, unos 2,4 MB (estimación RGBA, no medición GPU). No hay textura repetida, aleatoriedad por cuadro ni trabajo de Canvas adicional para el paisaje. La primera medición en la página con HMR se invalidó al sincronizar perfiles; se repitió con bundle estático y sólo se informa la pasada completa.

### Evidencia visual

[Close-up en reposo](evidence/close-up-rest.jpg), [una fuente](evidence/close-up-effects.jpg), [cuatro fuentes](evidence/close-up-four.jpg), [Open Field en reposo](evidence/open-field-rest.jpg), [Open Field con efectos](evidence/open-field-effects.jpg). Son capturas del documento integrado, no fondos sueltos. La grabación `evidence/playground-environments.webm` une dos segmentos en tiempo real: unos 12 s de fuente y 9 s de Open Field, con corte entre escenarios. 85 capturas (~4/s), sin interpolación ni audio; no representa la tasa de cuadros del motor.

Se verificó también el recorrido público: seleccionar cuatro cakes, intentar una quinta con Enter (aviso sin reemplazo), cambiar durante reproducción a Close-up (nuevo estado listo/0 s), recuperar Fairies in a Jar, filtrar Roman Candles conservando Ladybugs seleccionada y volver a Dallas recuperando los cuatro IDs. My List siguió con sus tres unidades preexistentes; no se editó. El ancho de documento y viewport fue 1440 px, sin overflow de página. No hubo errores ni advertencias de consola en las páginas revisadas.

[Selector Close-up](evidence/close-up-selector.jpg), [selector Open Field](evidence/open-field-selector.jpg), [selector Dallas](evidence/dallas-selector.jpg), [Dallas conservado](evidence/dallas-preserved.jpg). Los selectores son recortes de la página pública; las capturas completas de entornos se tomaron con el iframe visible para evitar capas fuera de pantalla omitidas por la herramienta de captura.

[Comprobación de audio digital](evidence/audio-scene-check.json): activación explícita a volumen 0,35, contexto running, una voz de fuente, RMS final de la muestra 0,046 y pico 0,099. Cambiar a la escena vacía la dejó idle, posición/duración 0 y sin iniciar otro contexto; el documento vacío no genera métricas de dibujo. La liberación del contexto anterior se verifica además en las pruebas del runtime. No se comprobó salida acústica física.

Para repetir el benchmark sin HMR: `node scripts/playground/environments-performance-static.mjs`, luego abrir `/artifacts/environments-performance.html`. No deben correrse grabación ni builds durante las pasadas.
