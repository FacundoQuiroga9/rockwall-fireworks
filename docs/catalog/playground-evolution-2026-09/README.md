# Playground panorámico y ampliación — 2026-09-25

> Informe histórico. Estado actual, grabación, perfiles y autorización de commit/push en [la continuación del 26 de septiembre](../playground-continuity-2026-09/README.md).


Vista previa local: <http://127.0.0.1:5176/playground>. Sin commit, push, despliegue ni publicación. Esta revisión continúa la [primera versión](../playground-2026-09/README.md); conserva sus cuatro perfiles completos, sin alterar sus eventos ni evidencia.

## Experiencia

- Escenario aéreo compartido para **0–4 selecciones**. Cero muestra instrucciones y bloquea reproducción; una funciona por sí sola. Todos los seleccionados de la escena arrancan desde el mismo origen temporal y terminan con su propia duración. El reloj global finaliza con el último perfil.
- Tarjetas enteras como botones con `aria-pressed`: foto, nombre, categoría y alcance breve. No contienen acciones anidadas. Las acciones de ficha, referencia y My List viven en un bloque independiente de la selección.
- Filtros All, Cakes, Artillery Shells y Fountains; sólo incluyen perfiles revisados. Búsqueda compacta en web. Con siete perfiles, la app conserva sólo los filtros. Filtrar no cambia selecciones ni reinicia la reproducción.
- Resumen con nombres, escena, quitar y Clear selection. Un quinto producto no sustituye ninguno. Clear filters es una acción distinta. Cualquier cambio de selección o escenario desmonta el documento anterior, limpia audio/animación y deja el nuevo reloj detenido en cero.
- Dallas sky y Fountain field se reproducen **por separado**: se conservan hasta cuatro selecciones globales y se informa cuántas corresponden a cada escena. No se mezclan las escalas terrestre y aérea.
- Pausa/continuación, reinicio, sonido optativo, volumen y momentos estáticos. Seleccionar nunca dispara ni agrega a My List. Sonido desactivado inicialmente y después de reemplazar el documento. Play selection arranca desde cero; Continue conserva una pausa explícita.

## Dallas y encuadre

Se inspeccionaron los recursos existentes: 800×268, 1440×482 y 2160×723. El de 2160 tiene alfa útil desde `(0,15)` hasta `(2160,723)`; no tiene grandes márgenes laterales. El tamaño pequeño anterior provenía del contenedor al 34% de altura con `object-fit: contain`.

La ciudad ahora ocupa el 100% del ancho conservando su proporción. Web usa 2160; la app embebe el recurso de 1440 para funcionamiento offline. Se recorta una parte del primer plano inferior, no las cimas emblemáticas, y se integra con una franja de bruma oscura. En horizontal corto se adapta ese recorte. No se repite ni deforma la ciudad, ni se alteran los archivos aprobados. Cielo amplio, estrellas estáticas y lanzamientos separados con etiquetas bajas.

El tamaño de cada efecto usa una cámara común dependiente sólo del espacio disponible, **no del número de seleccionados**. Las posiciones se distribuyen entre el 17% y el 83% del escenario. No se crean cuatro ventanas ni se ajusta cada explosión para llenar un panel. La ciudad es decorativa; posiciones y radios no son medidas físicas ni ubicaciones de uso.

## Perfiles disponibles

Total **7**: **2 cakes completas**, **2 muestras de una shell**, **2 extractos de cakes** y **1 extracto de fountain**. No se presenta ninguna muestra como cobertura completa del paquete.

| Nuevo producto | Identidad | Referencia inspeccionada | Segmento y alcance |
| --- | --- | --- | --- |
| Daffodil | Brothers BP2115 · 200g · presentación de 16 shots | [American Wholesale / demostración Brothers](https://www.youtube.com/watch?v=_8IthnKIchA) | 10,6–39,0 s, ≈28,4 s. Quince explosiones resueltas visualmente. El disparo restante del total anunciado no se inventa. |
| Ghost Dragon | Raccoon RA57219 · 500g · rack de 9 shots | [Raccoon](https://www.youtube.com/watch?v=6zFLJt1m7q8) | 7,5–42,3 s, ≈34,8 s. Ocho explosiones resueltas; una del total anunciado queda pendiente. |
| Fairies in a Jar | Brothers BP4315 · Fountain | [Brothers Pyrotechnics](https://www.youtube.com/watch?v=0XffbmTG7DA) | 5,6–50,6 s, ≈45 s. El video termina durante la actividad. No se declara duración total ni final del producto. |

Los cuatro perfiles previos son Bump Bear, Band of Brothers, Ghostacular y Maelstrom. Sus fuentes y análisis permanecen en el [informe inicial](../playground-2026-09/README.md). [approved-profiles-before.json](approved-profiles-before.json) permite comprobar que no cambiaron.

### Método y aproximaciones

Se vio contenido real de cada video en Chrome, silenciado y con muestreo por la barra de reproducción. No se utilizó sólo metadatos. Capturas y tiempos realmente leídos están en `evidence/*.json` y `evidence/*.png`:

- [Daffodil, recorrido](evidence/daffodil-sheet.jpg), [detalle 1](evidence/daffodil-dense-sheet-0.jpg), [detalle 2](evidence/daffodil-dense-sheet-1.jpg): muestreo de 0,5 s en la secuencia. Cometas blancos y pequeñas aperturas rojas/verdes con chispas doradas; cadencia individual sin final añadido.
- [Ghost Dragon](evidence/dragon-sheet.jpg): cuadros cada 1,5 s. Estelas plateadas más largas, puntas rojas/blancas que cambian por sectores. Los instantes de este perfil son estimaciones más gruesas, aproximadamente ±0,75 s; no tienen precisión de fotograma. Es necesario revisar más densamente para resolver la novena explosión.
- [Fairies in a Jar](evidence/fairies-sheet.jpg): cuadros cada 2 s. Chorro blanco/dorado estrecho con puntos rojos, luego grupos ramificados y acentos azules, finalmente predominio de grupos claros. Transiciones de etapas aproximadas ±2 s; no se afirma una cantidad de chispas ni una altura física.

Identidad y presentación se comprobaron contra las placas/packaging visibles y los códigos del maestro. No se observan varias unidades simultáneas ni cortes evidentes dentro de los tramos; eso no certifica la ausencia de edición o cambios de velocidad en el archivo original. En la fountain cambian encuadre/exposición, por lo que el tamaño aparente no se usa como magnitud física. No se analizó el audio original.

Daffodil usa un efecto de apertura compacta con pequeñas ramificaciones; Ghost Dragon usa radios largos y sectores de color; la fountain usa emisión continua con fases, intensidad, caída y agrupaciones secundarias. No son perfiles clonados con otro nombre. La trayectoria de partículas, la interpolación de sectores y la distribución de chispas siguen siendo aproximaciones. El aviso público permanece junto al escenario.

## Fuente terrestre

Fountain field es una composición Canvas/CSS propia: terreno abierto, horizonte bajo, base estable visible y fondo oscuro sin ciudad, personas ni edificios. El núcleo del chorro se conecta con la nube de chispas. Las tres etapas comparten el reloj absoluto; al reducir calidad se reduce densidad, no se alarga la fuente.

El sonido de la fountain es un siseo sintetizado suave en el motor existente. No contiene audio de YouTube ni archivos externos. Comparte el límite de cuatro voces y el compresor; no se presenta como potencia o sonido calibrado. La ramificación visible se aproxima sin destellos de pantalla completa.

## Fichas y sincronización

Cada uno de los siete productos recibe `demonstration` en la fuente maestra `src/data/products.json`, con resumen, alcance, duración observada, cantidad resuelta, efectos y referencia. [catalog-enrichment.json](catalog-enrichment.json) es una corrección persistente por ID y URL verificada por sync. No sobrescribe las descripciones ni características previas. La app recibe el mismo campo tipado.

Las fichas muestran “From the demonstration” y separan estas observaciones de las especificaciones previas. La duración de una shell se explica como muestra, no como duración del paquete; los nuevos extractos indican lo que falta. No se publican parámetros del motor como altura, potencia o radio comercial.

`playgroundSelection.js` centraliza límite, grupos y separación de escenarios. Perfiles, selección, timeline, renderer, audio, documento y runtime serializado se sincronizan como antes. No hay nuevas dependencias. Favoritos, almacenamiento de My List y PDF no cambiaron. Los tests conservan el hash del catálogo anterior al excluir únicamente el nuevo campo `demonstration`.

## Validación

- Web: `catalog:sync`, `catalog:check`, lint, **111 tests**, build: aprobados. [Log](web-validation.log).
- App: TypeScript, lint, **37 tests** y exportación Expo iOS/Android/web: aprobados. [Log](app-validation.log).
- Pruebas nuevas: 0–4, rechazo del quinto, quitar/limpiar, filtros con búsqueda, selección oculta, separación de escenas, finales distintos, ausencia de cues repetidos, fuente continua, invariancia de los cuatro perfiles aprobados, paridad de enriquecimiento y presupuesto global con cuatro secuencias sintéticas densas.
- Presupuesto global: 1.000 partículas escritorio / 420 compacto, repartido entre los perfiles activos. Calidad reduce principalmente densidad secundaria; formas y tiempos permanecen. Audio máximo cuatro voces, no cuatro por producto. DPR máximo 1,5 / 1,25.
- Navegador: fuente completa hasta 45 s y parada final; selección de cuatro, intento de quinto, filtros sin pérdidas, quitar durante reproducción y reinicio visible, escenas conservadas, teclado con Enter, consola sin errores en la revisión. Capturas de escritorio y documento compacto vertical/horizontal; no equivalen a tacto nativo.
- Alternativa web estática revisada en 390×844, 844×390, 768×1024 y 1024×768: sin overflow horizontal, canvas ni iframe. [Registro](responsive-checks.json). Dimensiones de Chrome y opción sólo de desarrollo; no UA/hardware reales. Enlace iOS y estado no publicado conservados.
- Cuatro cakes reales —Bump Bear, Band of Brothers, Daffodil, Ghost Dragon— hasta 34,8 s: **58,4 fps dibujados**, **0,54 ms de dibujo medio**, calidad High; 0 partículas al final. Incluye el final de tres explosiones de Band of Brothers. Una segunda pasada completa del renderer final registró **36,9 fps / 0,63 ms**, con Auto bajando a Low (objetivo 30 fps) tras un frame lento; terminó igualmente con cero partículas. No se oculta esa variabilidad del entorno. [Medición](performance.json).
- Entorno: Chrome automatizado sobre macOS 26.5.2, modelo de hardware no identificado. Tiempo CPU de Canvas, no GPU, batería ni rendimiento nativo. El estrés sintético de tests comprueba límites y distribución, no es una medición de fluidez.
- `public/.htaccess` y `dist/.htaccess` idénticos; ruta directa `/playground` revisada en Vite. Sin cambios de Hostinger ni validación del servidor publicado.

La prueba nativa sigue bloqueada: el intento actual de abrir `127.0.0.1:8087` devuelve `EPERM`. No se ejecutó la actualización en simulador o dispositivo. Quedan pendientes sonido y ciclo de vida de WebView en iOS/Android, entrada táctil, orientación/safe areas, lectores de pantalla, rendimiento y batería reales. La exportación de Expo y `compact-review.html` son comprobaciones distintas de una prueba nativa.

Los PDF conservan su generador intacto y las pruebas existentes de paginación/promociones. Esta iteración no modificó ni volvió a aprobar el diseño del PDF. No se realizó escucha física de audio. No hay grabación continua: se entregan capturas reales de interfaz; no se fabricó una grabación a partir de momentos estáticos.

## Artefactos y siguiente lote

- [Panorama con cuatro](screenshots/panorama.png), [selector](screenshots/selector.png), [fountain](screenshots/fountain.png), [ficha enriquecida](screenshots/product-observations.png).
- [Motor compacto vertical](screenshots/compact-portrait-browser.png), [horizontal](screenshots/compact-landscape-browser.png): navegador, no app instalada.
- [Pendientes por producto](pending.csv): incluye candidatos con video todavía no analizados, productos sin referencia actual y problemas particulares. “No revisado en este lote” no significa que falte o falle su video.
- Antes de ampliar, resolver el conteo pendiente de Daffodil y Ghost Dragon con inspección más densa; buscar una toma completa de Fairies in a Jar. Ninguno debe convertirse en “Full sequence” sólo cambiando una etiqueta.
- Siguiente lote sugerido: más muestras de artillery/canister con efecto identificable y cakes con abanicos o caídas prolongadas. Bamboozle continúa pendiente por su secuencia mixta compleja. No se añadió otra shell en este lote.
- Para incorporar otro: seguir el método de la primera versión, añadir evidencia y perfil; actualizar índice/enriquecimiento; validar identidad, escena y continuidad de etapas; sync/check; revisar la secuencia frente al video y medir con cuatro. No deducir especificaciones de los valores del renderer.
