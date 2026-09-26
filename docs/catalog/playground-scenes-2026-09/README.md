# Escenarios compatibles, cakes y ampliación — 26 de septiembre de 2026

Vista local: <http://localhost:5173/playground>. Continuación de [fountains y catálogo](../playground-continuity-2026-09/README.md). Sin despliegue ni publicación de la app. Commit y push de ambos proyectos autorizados por el propietario.

## Selección y reproducción

Cada perfil declara `scene: aerial | ground`. El nombre, la categoría comercial y los filtros no determinan compatibilidad. Elegir una fountain activa Ground; elegir un perfil aéreo activa Dallas. Se guardan **hasta cuatro IDs por familia en memoria durante la sesión del proceso/página**, independientes de My List y favoritos. Navegar entre fichas y Playground conserva ese estado; cerrar o recargar la página/proceso inicia una sesión nueva.

Sólo la familia activa aparece marcada, en el contador, en el resumen, en las acciones y en el documento de reproducción. La otra pestaña indica `N saved`. Seleccionar un producto recordado de la otra escena recupera esa selección sin desmarcarlo. Seleccionar otro añade el producto si queda lugar. Si el destino está lleno se recuperan sus cuatro productos y se informa `Four picks in this scene. Remove one before adding another.`; el quinto no entra ni reemplaza a nadie. Filtrar no cambia escena ni selecciones. Clear active selection limpia sólo la familia actual; quitar el último producto deja esa escena vacía.

El documento anterior recibe destroy y se desmonta: RAF, partículas, observador y audio se liberan. El nuevo documento parte detenido en cero con sonido apagado. Se conservan volumen y calidad, sin recrear el documento por cada movimiento del control. La lógica compartida normaliza restauraciones y rechaza perfiles duplicados, más de cuatro, IDs desconocidos o familias incompatibles; timeline y generador HTML también validan la entrada. El renderer sigue acotado a 1.000 puntos de escritorio / 420 en compacto. No se alteró el modelo de emisión continua de fountains ni sus parámetros por partícula al nacer.

[Grabación del recorrido real](review/automatic-scene-switch.webm): selección aérea → fountain → regreso al cielo agregando Band of Brothers → recuperación de Fairies. Captura continua de 137 cuadros, 21,98 s, aproximadamente 6,2 cuadros/s. Conserva los tiempos de captura; no es una composición de momentos elegidos ni una medición de FPS del motor. Se codificó en VP9 sin audio. [Tiempos originales](review/recording-capture.json). La captura directa mediante selector de pantalla quedó bloqueada por la revisión automática del control de Chrome; se utilizó captura continua de la pestaña mediante CUA.

## Gramajes

| ID / producto | Identidad del catálogo | Decisión |
| --- | --- | --- |
| `mass-confusion` | Black Cat, 45 shots, SKU 715244065356 | **500g**, confirmación del propietario |
| `light-brigade` | Brothers, 42 shots, SKU 687985245314 | **500g**, confirmación del propietario |
| `2-minutes-extravaganza` | TNT, SKU 887946004213; presentación textual no confirmada | **500g**, confirmación del propietario |
| `old-ironsides` | Brothers BP2452, 30 shots, UPC/SKU 687985245215 | **Gramaje sin confirmar**: contradicción 200g/350g no resuelta |

Las tres confirmaciones están en [owner-cake-corrections.json](owner-cake-corrections.json), aplicadas después de los informes históricos por `catalog:sync`. Sync valida ID, nombre, fotografía, marca, presentación y SKU. Conserva rutas, fotos, códigos y las demás especificaciones. Catálogo: 38 cakes de 200g, 73 de 500g, cinco packs y una excepción sin gramaje confirmado. Los dos grupos principales no se renombraron: falta base firme para ubicar Old Ironsides en uno de ellos.

Las promociones permanecen sin cambios. Una categoría nueva no otorga BOGO o cupón. My List conserva snapshot y cantidades anteriores; el mecanismo existente exige revisión de cada cambio comercial, sin borrar unidades ni conceder beneficios. [Estado anterior de los cuatro productos](catalog-before.json).

### Old Ironsides: evidencia y decisión

- [Ficha oficial Brothers BP2452](https://www.brotherspyrotechnics.com/ProductDetails/1109): Old Ironsides, 30 shots, Heavy Weights, empaque 8/1, dimensiones de unidad 9¼ × 7⅞ × 6 pulgadas. **Gr. Wt. 18 kg** corresponde al peso bruto de la caja de envío; no es contenido pirotécnico. No publica 200g, 350g ni 500g. El [listado oficial Heavy Weights](https://www.brotherspyrotechnics.com/CoverDetail/41?page=20) tampoco resuelve gramos.
- [American Wholesale](https://americanwholesalefireworks.com/old-ironsides/) identifica **BP2452 y UPC 687985245215**, 30 shots, como 200 Gram Cake. Es una coincidencia exacta de código, pero entra en conflicto con la otra clasificación comercial.
- [Superior Fireworks, 5 de mayo de 2020](https://www.superiorfireworks.com/blog/2020/05/all-about-350-gram-repeaters/) incluye Old Ironsides entre los repeaters de 350g. Su [350 Gram Finale 3-Pack](https://www.superiorfireworks.com/wholesale/product/wksf11191/350-gram-finale-3-pack), KS5001, agrupa Old Ironsides con Current Events e Irish Legend. El dato del pack no acredita por sí solo el lote/UPC individual de nuestro inventario.
- La foto aprobada del catálogo permite leer **BP2452 / 30 shots / Heavy Weights**; no permite leer un gramaje. No se dedujo por tamaño de caja, peso de envío, mayoría de resultados ni rangos “up to 500g”.

**Decisión:** conservar `cakeClass: {status: unconfirmed, grams: null}` y la excepción existente `Cakes - Size Unconfirmed`. No afirmar 350g como dato real ni forzar 200/500. Falta una declaración del fabricante o etiqueta legible de contenido/clasificación que corresponda al BP2452/UPC de la unidad almacenada. Una eventual agrupación comercial de 350g se decidirá separadamente de la elegibilidad promocional. No hubo contacto con terceros.

## Seis incorporaciones funcionales y una referencia mejorada

| Producto y variante | Referencia | Segmento fuente | Alcance publicado |
| --- | --- | --- | --- |
| Golden Peacock, Brothers BP2112, 16 shots, 200g | [Spirit of ’76 MS187](https://www.youtube.com/watch?v=0ZGF8eiJvcc) | 3,7–44,5 s | **Secuencia completa**; 16 aperturas resueltas; Approx. 41 sec |
| Ghost Killer, Raccoon RA57217, rack 9 shots, 500g | [Raccoon](https://www.youtube.com/watch?v=oqXARGKUAXk) | 6–47 s | **Extracto**; ocho aperturas resueltas, novena pendiente; Preview · Approx. 41 sec |
| U.S. Power, Raccoon RA22534, 16 shots, 200g | [Raccoon](https://www.youtube.com/watch?v=b0xT23KjsGk) | 6,1–23,4 s | **Extracto**; once aperturas separadas, excluye finale superpuesto; Preview · Approx. 17 sec |
| Arms Depot, Raccoon RA11601, 4-inch / 16 shells | [Raccoon](https://www.youtube.com/watch?v=Lo4tueGSQgs) | 6,2–9,8 s | **Una shell**; Shell sample · Approx. 4 sec |
| Sniper Fire, Raccoon RA11201, 4-inch / 12 shells | [Raccoon](https://www.youtube.com/watch?v=66butJ3I7Tw) | 6,2–10 s | **Una shell**; Shell sample · Approx. 4 sec |
| Movie Time, Brothers BP4213 | [Brothers](https://www.youtube.com/watch?v=JNSp9V7rLGo) | 6–87 s | **Extracto de fountain**; Preview · Approx. 1 min 21 sec |
| Jumboshell Fountain, Brothers BP4247 (perfil existente) | [Spirit of ’76 FG114](https://www.youtube.com/watch?v=5KN5suDvKhg) | 5,3–155,4 s | **Mejorado a secuencia completa**; Approx. 2 min 30 sec |

Total **19 perfiles**: cuatro cakes completas, cinco extractos de cakes, seis muestras individuales de shells, dos fountains completas y dos extractos de fountains. Nueve cakes, seis shells y cuatro fountains. No se cuenta una muestra como demostración completa de un paquete.

Se inspeccionó el contenido real de los videos silenciados, no sólo títulos. Los JSON de `evidence/` registran URL y tiempos leídos; las hojas de contacto permiten revisar color, apertura y ritmo. No se vieron disparos simultáneos de varios productos ni cortes evidentes dentro de los segmentos adoptados; esto no certifica la ausencia de edición en los originales. Los finales no resueltos o agrupaciones ambiguas se declaran como tales.

Los perfiles tienen secuencias propias: Golden Peacock mantiene sus 16 cometas y pequeñas aperturas irregulares; Ghost Killer utiliza estrellas por sectores que se apagan y revelan puntos azules; U.S. Power usa trayectorias cortas que cambian de dirección. Arms Depot abre ramas claras y luego grupos rojos; Sniper Fire lleva más ramas finas de cobre y pequeños puntos blancos. Densidad, trayectorias, brillo y escala son aproximaciones del motor. Los tiempos son estimaciones (≈±0,5 s en aéreos; ≈±2,5 s en etapas terrestres), aunque se conservan sus valores precisos sin redondear en los eventos.

Movie Time conserva una interrupción real: emisión fuerte a 46–48 s del video, últimas chispas a 49 s, oscuro a 50 s, retorno a 51–52 s. El motor deja terminar cada partícula y vuelve a emitir; no reemplaza una imagen. La salida tras el extracto es **simulada**, registrada en `ending.kind`, y sus 3,6 s adicionales de cierre/cola no se publican como duración del producto. [Base real y emisión](review/movie-time-base.png); crop y punto de salida en `playgroundBases.json`, independiente del perfil. La foto aprobada se reutiliza y se incorpora offline a la app.

Jumboshell usa una toma nueva completa, no una extensión por repetición. [Liberty](https://www.libertyfireworks.us/products/jumbo-shell) relaciona BP4247 con FG114 y esta demostración; el envase redondo dorado coincide. A 151,4–152,4 s hay chorro, a 153,4 s quedan chispas y a 154,4 s el escenario está oscuro. Se archivó [el perfil anterior](jumboshell-excerpt-before.json), se registró la nueva URL en [video-updates.json](video-updates.json) y se sincronizó ficha/app. El encuadre y la exposición cambian respecto de la fuente anterior; no se infiere altura física ni se añaden colores que no se distinguen.

## Catálogo público y continuación

Las descripciones permanecen en inglés comercial, sin narrar la investigación. Ejemplos:

- Arms Depot: “Pale silver-blue branches blossom into small red clusters, leaving a soft scattering of white sparks.”
- Golden Peacock: “Green comets rise in a steady sequence, opening into small golden bouquets with bright, crackling sparkles.”
- Movie Time: “Golden sprays break into bright sparkling clusters, settle into a brief pause, then return with white sparks and fuller gold showers.”

El enriquecimiento persistente vive en `playground-evolution-2026-09/catalog-enrichment.json`; notas y fuentes quedan internas. `durationLabel` y el total del reloj redondean sólo presentación; no cambian eventos ni sincronización. Watch the reference sigue la ruta `/products/{slug}#product-video`, con un único reproductor diferido, compensación del header, foco accesible y sin autoplay. En app permanece el enlace externo.

Pendientes concretos: novena apertura de Ghost Killer y Ghost Dragon; decimosexta de Daffodil; grupos finales de U.S. Power y American Anthem; final real de Super Fountain y Movie Time; variantes/cargas simultáneas de Full Speed; análisis completo de Bamboozle. No se agregaron perfiles genéricos para esos huecos. El [inventario pendiente actualizado](pending.csv) retira las muestras/completas ya incorporadas, conserva los extractos con su límite concreto y mantiene los candidatos todavía no analizados sin inferirles efectos. Los informes previos permanecen como historial.

Para incorporar otro perfil: verificar ID, código, marca y presentación; inspeccionar el video y sus cortes/unidades; registrar los tiempos realmente revisados; definir el alcance conservador; declarar escena explícita; construir eventos o etapas propios; separar agotamiento y cola; usar una base aprobada para fountains; enriquecer la fuente persistente; ejecutar sync/check y ambas baterías; comparar forma, movimiento y final; medir con cuatro. No editar sólo archivos generados de la app. [Validación y pendientes de dispositivo](VALIDATION.md).
