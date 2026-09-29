# Auditoría temporal y visual — 2026-09-28

Continuación de [entornos y seis extractos](../playground-environments-2026-09/README.md) y de [la tanda de diez cakes](../playground-cakes-2026-09/README.md). **302 productos, 53 perfiles. Ocho perfiles corregidos y dos altas. Las cakes y la auditoría visual histórica todavía no están completas.** No despliegue ni publicación. La revisión visual nativa está **pospuesta por decisión del usuario**; no se abrió Simulator, Metro ni dispositivos y no se generaron exportaciones.

## Aggression: causa y comparación

ID `aggression`, **Raccoon RA22007, cake de 25 shots / 200g**, fotografía aprobada coincidente. [Referencia del catálogo](https://www.youtube.com/watch?v=fLGTxYPM494), [upload del fabricante](https://www.youtube.com/watch?v=BcWDnh162Vk). Son la misma toma con introducciones diferentes, no dos disparos independientes.

El perfil anterior publicaba sólo cinco aperturas rojas: ventana 6,80–13,60 s, **6,80 s de reproducción**. Faltaban los grupos verde, ámbar y teal y las cinco aperturas del final de flores crepitantes. No había un factor de velocidad incorrecto ni una normalización que dividiera los tiempos. La etiqueta anterior decía Preview, pero la cobertura era insuficiente frente a la demostración disponible.

La reconstrucción conserva los cinco primeros tiempos absolutos y agrega los eventos faltantes, sin estirar el prefijo. Se revisó la toma completa a velocidad normal y las zonas superpuestas a 0,25× utilizando el reloj original del video:

| Hito | Tiempo absoluto de referencia | Tiempo del perfil |
|---|---:|---:|
| Ascenso tenue/inferido | 7,06 s | 0 s |
| Primera apertura visible | 7,90 s | 0,84 s |
| Último lanzamiento modelado | 18,12 s | 11,06 s |
| Última apertura | 18,96 s | 11,90 s |
| Extinción visual significativa | ≈22,20 s | 15,14 s |

**Intervalo visible verificable desde la primera apertura: aproximadamente 14,30 s. Modelo corregido, incluido el ascenso ilustrativo: 15,14 s; texto público “Approx. 15 sec”.** El primer lift es una inferencia discreta porque está muy tenue/recortado; no se publica como estela comercial confirmada. El umbral del último brillo tiene incertidumbre visual de aproximadamente ±0,4 s. Los trece segundos indicados por el usuario se tomaron como señal para investigar, no como objetivo numérico. Se excluye el outro del comercio, que empieza alrededor de 23,4 s.

[Grabación antes/después y Fuego Loco](evidence/fidelity-before-after.webm): 45,01 s, tres segmentos continuos con cortes rotulados. 147 capturas reales del documento de producción, reproducidas a sus tiempos originales, aproximadamente 3–4 imágenes/s, sin interpolación ni audio. No representa el FPS del motor. El segmento anterior usa el perfil histórico de cinco aperturas; no es una grabación del sitio publicado anterior. [Detalle de las referencias](evidence/reference-details.jpg), [reproducción corregida](evidence/after-playback.jpg).

## Criterio temporal y correcciones compartidas

La duración de la representación va del primer lanzamiento/emisión del perfil hasta el final significativo de los efectos incluidos. Se registran por separado primer lift, último lift, última apertura y extinción. Se excluyen títulos, introducciones y tiempo vacío. Si un ascenso está fuera de cuadro, se declara como inferencia y no desplaza el burst observado. La duración del archivo no se convierte en duración comercial. Un extracto conserva Preview; una muestra de shell no describe la duración de todo el paquete ni el tiempo entre clics.

[Observaciones y eventos absolutos](observations.json), [comparación mecánica de las 31 cakes anteriores](audit.json), [cobertura por ID](cake-coverage.json). Las cifras internas conservan decimales; la presentación utiliza el formateador existente. Los onsets densos son estimaciones visuales, generalmente ±0,1–0,15 s, no mediciones calibradas por fotograma. Las capturas a 1× pueden contener latencia entre lectura del reloj y adquisición de imagen; las separaciones críticas se revisaron más lentamente. Se descartaron capturas con el reproductor parcialmente fuera de pantalla o con composición defectuosa.

- El timeline calcula un límite defensivo a partir de las vidas de los eventos. Una duración declarada obsoleta ya no autoriza borrar una cola todavía activa; el validador rechaza ese dato para evitar publicarlo silenciosamente.
- El renderer deja terminar cada evento en lugar de cortar todo el perfil al llegar a su duración. Las vidas de componentes secundarios se validan contra la del padre. El último brillo secundario antiguo de Jawbreaker excedía la vida de su evento: se corrigieron ambos datos.
- Las flores retardadas de un bouquet se apagan dentro de la ventana del evento. El valor fijo anterior de 1,4 s podía cortar flores aún luminosas, en las flores de Vertical Limit y Wild Horses, particularmente en el último evento de Wild Horses. El perfil no gana disparos ni segundos; la envolvente se ajusta al tramo revisado. `clusterLife` permite una cola mayor cuando la referencia la respalda, como el final de Aggression.
- Al detener/reiniciar, las métricas consultan los recursos actuales. Antes podían seguir mostrando voces del cuadro anterior después de `audio.stop()`. No se aumentó el volumen ni se cambió el sintetizador para ocultar el problema.
- La calidad modifica detalle y presupuestos, nunca el reloj ni los tiempos de eventos. Pausa y continuación conservan la posición y los cues se despachan una sola vez. Las pruebas incluyen cadencias de 60, 30, 12 y aproximadamente 6 cuadros/s y una duración declarada deliberadamente demasiado corta.

## Perfiles corregidos y altas

| Producto / ID | Antes: aperturas / segundos | Ahora: aperturas / segundos | Alcance y resultado |
|---|---:|---:|---|
| Aggression `aggression` | 5 / 6,80 | 25 / 15,14 | Completa. Cuatro grupos cromáticos y cinco centros finales; cola restaurada. |
| Jawbreaker `jawbreaker` | 15 / 19,00 | 25 / 28,74 | Extracto. Añade azul→rojo y cinco flores finales; el fundido editorial limita la cola verificable. |
| Willow Explosion `willow-explosion` | 4 / 11,15 | 24 / 20,95 | Extracto. Ráfagas intermedias y cuatro aperturas finales; brillos muy tenues alcanzan el límite de la toma. |
| Old Ironsides `old-ironsides` | 13 / 20,00 | 27 / 36,50 | Extracto. Grupos posteriores azul/blanco, blanco y palmas doradas. Faltan tres centros frente a los 30 comerciales. |
| Color Rage `color-rage` | 4 / 9,95 | 30 / 33,80 | Completa. Seis ciclos de cinco colores, aceleración y salva final; el brillo retardado no cuenta como otro shot. |
| Whisky Business `whisky-business` | 14 / 32,65 | 14 / 31,92 | Extracto. No se agregan eventos: elimina márgenes vacíos, conserva tiempos absolutos y caída final. Faltan seis centros. |
| Whacky Tobacky `whacky-tobacky` | 8 / 25,90 | 9 / 24,89 | Completa. Se resolvió el tercer centro de la salva final y se eliminó el margen inicial. Seis onsets anteriores conservados. |
| Migraine `migraine` | 6 / 25,00 | 9 / 30,82 | Extracto. Añade tres coronas blancas distintas de los anillos anteriores; cola limitada por la referencia. Los seis onsets previos se confirmaron y conservaron. |
| **Fuego Loco `fuego-loco`** | Sin perfil | 20 / 21,07 | **Alta completa**, Black Cat, caja aprobada roja/azul de 20 shots. Palmas de puntas rojas, brillo y grupos dorados; final propio. |
| **Walkin’ Dead `walkin-dead`** | Sin perfil | 18 / 20,72 | **Alta como extracto**, Black Cat BC6317. Cambios rojo→verde y salva final; un centro pendiente frente a 19 shots confirmados. |

Fuentes adicionales: [Jawbreaker RA22009](https://www.youtube.com/watch?v=Vm9Ug3rc84A), [Willow Explosion RA53631](https://www.youtube.com/watch?v=AtqiNrQGq-0), [Old Ironsides BP2452](https://www.youtube.com/watch?v=3d8P_pGNLc4), [Color Rage RA53072](https://www.youtube.com/watch?v=NvDuDojoKT4), [Whisky Business BS8039](https://www.youtube.com/watch?v=SxzplhvlmUk), [Whacky Tobacky BP2501](https://www.youtube.com/watch?v=kfKXaQZ-2rk), [Migraine RA57207](https://www.youtube.com/watch?v=ElEOhs6JI0U), [Fuego Loco](https://www.youtube.com/watch?v=ua-qvzDNDPg), [Walkin’ Dead](https://www.youtube.com/watch?v=egB6g9q3aXk). [Black Cat confirma 19 shots de Walkin’ Dead](https://blackcatfireworks.com/top-10-best-200-gram-cake-fireworks-black-cat/): “20/1” en el título mayorista no se utilizó como shots ni como cantidad del paquete minorista.

Se revisaron las fuentes reales. Para Old Ironsides y Whisky Business se volvió sobre las capturas completas temporizadas de la iteración anterior; no se afirma una nueva reproducción íntegra de esos dos videos en esta sesión. Los métodos específicos quedan en `observations.json`. No se observaron cambios de velocidad ni otra zona de disparo en las ventanas publicadas; esto no equivale a una certificación de la filmación.

El overlay [catalog-enrichment.json](catalog-enrichment.json), protegido por ID y URL de referencia, persiste después de `catalog:sync`. Sólo se actualiza la descripción demostrativa; no se cambian IDs, categorías, promociones, gramajes, fotografías ni cantidades de My List. Ejemplos: “Red stars give way to quick green, amber and teal salvas over pale gold trails, finishing in a spreading cloud of crackling flowers”; “Preview · Approx. 29 sec” para Jawbreaker. La procedencia no aparece dentro del texto comercial.

## Alcance pendiente de la auditoría

El inventario mecánico cubre las **31 cakes anteriores**, con límites de eventos, normalización, scope y fuente; no debe confundirse con una nueva comparación visual completa de las 31. Además de las ocho corregidas:

- **Pyro Pilot P5182:** referencia completa de 27,54 s reproducida a 1× y tramo posterior a 0,5×. El perfil de 8,15 s contiene cinco aperturas iniciales. Quedan efectos bajos/giratorios entre aproximadamente 12,3–14,3 y 22–24 s y centros finales superpuestos; no se sustituyen por esferas genéricas ni se afirma secuencia completa.
- **Magnum Tremors RA57206:** toma completa revisada a 1×; el ritmo de seis coronas y su caída coincide con el perfil. El final de aproximadamente 32 s conserva un centro no separado frente al total comercial de nueve. Sin cambio de velocidad observado; continúa como extracto de ocho aperturas.
- **Neon Jellyfish RA57212:** toma completa revisada a 1×; se ve una apertura verde posterior al tramo publicado y partes de los anillos salen del encuadre. La revisión fina se interrumpió por errores de espacio en disco. No se publicaron ese tiempo ni un noveno centro inventado. [Detalles de los casos pendientes](evidence/unresolved-reference-details.jpg).
- **Sky Ink, Wild Horses, Wild West, Nation Ovation, Dreams from Heaven y Strobing Willow:** se revisaron los registros y límites del motor; falta la nueva comparación íntegra de sus videos en esta auditoría. Wild Horses recibe la corrección compartida de apagado de bouquet, sin cambiar eventos. Tampoco se declara revalidación visual nueva de las tandas anteriores Vertical Limit, One Bad Mother-In-Law, Hot Dog o Battle Cry, ni de los bancos de shells históricos.

**La auditoría visual solicitada de todas las tandas no está cerrada.** Errores repetidos `ENOSPC` limitaron la captura/análisis adicional. Se redujeron únicamente capturas y cachés de compilación regenerables; los PDF personales preexistentes se preservaron. Las fuentes pendientes siguen enlazadas y los perfiles aprobados restantes no se modificaron sin evidencia. La matriz distingue revisión de registros, revisión de referencia y reproducción del resultado.

Candidatos nuevos revisados pero no publicados: **The Reaper RA53629**, toma completa de 42,64 s con sección larga de giros/reportes bajos que exige atribución individual; **Light Brigade BP2453**, toma de 76,20 s y 42 shots con cometas/giros bajos y secuencias superpuestas aún sin resolver. No se bloquearon por gramaje ni se rellenaron con perfiles genéricos.

## Cobertura y continuación

**117 IDs de cakes:** 12 secuencias completas, 21 extractos y 84 sin perfil. Entre los 84: 64 con referencia enlazada todavía sin análisis suficiente, nueve con referencia revisada y componentes/cortes pendientes, dos con identidad bloqueada, cuatro presentaciones especiales y cinco packs. [Lista por ID, motivo y fuente](PENDING.md).

**53 perfiles totales:** 16 secuencias completas, 23 extractos y 14 muestras. Por familia: 33 cakes (12/21), seis fountains (4/2), once bancos de shells y tres muestras de Open Field. Las dos altas son una completa y un extracto; ningún shell ni otra familia se añadió. La memoria por escenarios, selector horizontal, lanzamientos, oclusión de Dallas, bases reales, sonido, calidad, favoritos, promociones y PDF permanecen.

Para continuar: resolver primero los tramos señalados de la tanda de diez cakes, contrastar el reloj del video y revisar toda la cola antes de promover un extracto a completo. Conservar la separación entre evento principal y componentes. Actualizar perfiles, índice, overlay y esta matriz; ejecutar sync/check antes de revisar la app por paridad. La revisión visual nativa requiere una etapa posterior autorizada por el usuario.

## Validación y entorno

Resultados finales en [VALIDATION.md](VALIDATION.md). Cada uno de los ocho perfiles corregidos y las dos altas recorrió en Chrome la ventana publicada hasta su estado final con cero partículas. [Whacky Tobacky y Migraine](evidence/earlier-batch-corrections.jpg), [Fuego Loco](evidence/fuego-loco-playback.jpg), [Walkin’ Dead](evidence/walkin-dead-playback.jpg), [Color Rage](evidence/color-rage-playback.jpg), [Willow Explosion](evidence/willow-explosion-playback.jpg). El render compartido y los datos de la app son idénticos; no es una prueba nativa.

[Medición de carga](evidence/performance.json): Chrome 153/macOS, DPR 2, ocho procesadores lógicos expuestos; modelo físico no identificado. Canvas CSS 1280×640. Tres pasadas de 35 s sin grabar: Aggression, Color Rage, Willow Explosion y Fuego Loco. Auto/High: 59,94 fps, CPU media/p95 1,56/3,80 ms; High: 60,03 fps, 0,58/1,30 ms; Balanced: 60,03 fps, 0,42/0,90 ms. Picos: 652 partículas/1.915 puntos en High, 482/1.044 en Balanced. Auto tuvo un intervalo >50 ms y un máximo de dibujo de 42,5 ms; las otras dos pasadas no. Heap JS pico 36,3/31,4/31,7 MB. Sin cambios sostenidos de calidad; buffer 2560×1280 en High y 1920×960 en Balanced. No se midió GPU, batería, temperatura ni rendimiento nativo. La pasada inicial incluye calentamiento y no se presenta su diferencia de CPU como una mejora entre Auto y High.

La mezcla de tres cakes y Nishiki verificó pausa a 0,299 s, primer lanzamiento contado una vez, segundo durante las cakes y tercero después de terminar éstas. Se verificó señal digital y contexto de audio activo; **no se comprobó salida física audible**. El registro anterior a la corrección de métricas conserva la muestra que reveló voces desactualizadas y se acompaña con la comprobación posterior.

Vista previa: <http://localhost:5173/playground>. Galería reproducible: `node scripts/playground/fidelity-review-static.mjs`, luego `/artifacts/fidelity-review.html`; documento de producción sin HMR durante capturas. Benchmark: `/scripts/playground/fidelity-performance.html`. No dependencias nuevas; artefactos temporales ignorados por Git, evidencia compacta versionada. Dallas, el hero y los entornos no se regeneraron ni rediseñaron.


## Seguimiento 2026-09-29

La [ampliación de cakes del 29/09](../cake-expansion-2026-09-29/README.md) añade Alien Attack y Viva Mexico completas, Avalanche y Forever Loyal como extractos. Cobertura vigente: 16 completas, 24 extractos, 77 sin perfil (incluidos packs, presentaciones especiales y bloqueos). Daffodil se reexaminó sin resolver 15/16 y conserva su perfil. La matriz nueva concilia los 117 IDs y mantiene los pendientes individuales. La revisión visual nativa sigue pospuesta.
