# Rockwall — catálogo, BOGO, flyer 2026 y PDF compacto

Revisión local del 25 de septiembre de 2026. Base web `af99a9a`, app `c06142d`. Los dos repositorios empezaron limpios. No se hizo commit, push, despliegue ni publicación. Las instrucciones de esta iteración sustituyen la autorización anterior de push.

## Cambios y paridad

- Se conservan los **302 IDs**, rutas, favoritos, claves de almacenamiento v1 y selecciones existentes. `catalog:sync` aplica las correcciones por identidad antes de copiar datos a la app; `catalog:check` compara cada producto, los módulos compartidos, promociones y SHA-256 de imágenes.
- Boomer sí tenía una asociación: **Poopy Puppy**. Se conserva el producto y su evidencia histórica, pero su marca deja de publicarse mediante una corrección explícita en `manual-corrections.json`. Aparece bajo Other brands. No se reasigna a Boom Wow. Los enlaces viejos `?brand=Boomer` se normalizan a todas las marcas, conservando otros filtros. Super Magnum sigue World-Class y Silent Treatment sigue Fox.
- El maestro incorpora 68 videos nuevos, 11 derivados fotográficos mejores y dos correcciones de clasificación: Captain Sam a 200g y Mass Confusion a pendiente por evidencia contradictoria.
- La interfaz aprobada, hero, plataforma, navegación y guía My List se conservan. No se restauró el enlace de 2025 en el hero.

## Causa del fallo BOGO

El filtro usaba `getBogoState(...).active`. Ese estado exige vigencia, elegibilidad comercial actual y reglas completas de bonificación; por eso los ocho productos con marcador de inventario desaparecían cuando la campaña estaba pendiente.

Ahora `isBogoIdentified` exige el marcador estructurado `source-marked` y tokens de origen. Filtro, cards y candidatos de My List comparten ese criterio. `eligible` y `active` siguen separados para evaluar el beneficio; no se derivan del nombre ni de toda una categoría.

**BOGO only devuelve 8 productos sin otros filtros; 0 beneficios se aplican automáticamente.**

| Producto | ID | Categoría |
|---|---|---|
| Freedom’s Wings | freedoms-wings | Fountains |
| Little Dynamite | little-dynamite-100 | Firecrackers |
| M-150 Red Salute | m150-red-12-pack | Firecrackers |
| Black Cat Firecrackers 50 Pack | black-cat-50-pack | Firecrackers |
| Black Cat Firecrackers 200 Pack | black-cat-200-pack | Firecrackers |
| M-5000 Salute Crackers | m-5000-world-class-12-pack | Firecrackers |
| Party Poppers | party-poppers-6-pack | Novelties |
| Unicorn Chaser | unicorn-chaser-2-pack | Novelties |

Se volvieron a cruzar **68 filas de origen marcadas BOGO** por token y SKU contra el catálogo publicado. No se encontró otra vinculación exacta que justifique agregar un noveno producto. Evidencia: [revisión del cruce](bogo-recheck.json), [filas CSV/Excel preservadas](../my-list-2026-09/bogo-evidence.json). El volumen externo original no estaba montado; no se afirma haber reabierto esos originales.

Los pares se eligen explícitamente, dentro de la misma categoría comercial y sin restricción de marca. Siguen pendientes fechas vigentes, asignación de unidad bonificada cuando difieren los precios, límites y compatibilidad. My List/PDF mantienen cantidades seleccionadas y guiones en paid/free para las unidades pendientes. Convertir un grupo en individuales conserva unidades; no reutiliza una unidad en dos beneficios.

## Independence Day 2026

Se abrió y renderizó el **`rf coupons.pdf` de la raíz web**, dos páginas, distinto del archivo 2025 de `public/`. SHA-256 `9a9f6aa9fba48d1ee415388d5bacadc582fa1caa7b547c4b3a6aa5937b409b3e`, sin modificar. Registro compartido en `src/data/promotions.json`; evidencia y bloqueos por oferta en [flyer-2026-evidence.json](flyer-2026-evidence.json).

| Oferta | Lo que confirma el documento | Estado público |
|---|---|---|
| 500g Cakes | $50–$125 según selección; no precio por ID; página 2 | Venció 4 julio 2026 |
| Three 200g Cakes | Elegir 3 por $75; página 2 | Venció 4 julio 2026 |
| 24-count 60g Artillery Shells | $75 por paquete minorista de 24; página 2 | Venció 4 julio 2026 |
| Super 500 Gram Finales | Especial $500–$750, regular $900; cantidad/composición no especificadas; página 1 | Archivada; vigencia actual no confirmada |
| Buy One, Get One | Una unidad adicional; muchos artículos, sin IDs completos; página 1 | Archivada; reglas incompletas |
| Scratch-off prizes | Tarjeta original, PIN coincidente y validación en tienda; premios históricos registrados; página 1 | Archivada; no se adjudica un premio digital |

Las ilustraciones **no son una lista exhaustiva de elegibles**. Se identifican por separado American Wildcard, Fuego Loco, Sky Ink, Let Freedom Ring y otros ejemplos; no se convierten en `eligibleIds` activos. Hay discrepancias: el panel 500g muestra Call the Cops 200g, Mass Confusion con etiqueta 200g y 250 Paratroopers; el panel 200g incluye imágenes de fuentes. El rango “hasta 500g” de un proveedor no resuelve el gramaje exacto.

No se encontró una composición fija completa que permita activar un paquete real. El motor admite composición fija automática, selección configurable sólo entre IDs autorizados, progreso de cantidades, edición y eliminación; se probaron con fixtures explícitos TEST ONLY. **Ninguna oferta 2026 es seleccionable hoy.** La UI ofrece el archivo de referencia colapsado y conserva los productos individuales y pares pendientes.

Para habilitarlas faltan: nueva vigencia confirmada, IDs/variantes elegibles completos, cantidades/composición para finales, precios por selección donde correspondan, límites y compatibilidad. Cambiar sólo `status` o las fechas no supera el bloqueo de elegibilidad.

## Videos y cakes pendientes

- **68 videos agregados:** 226 productos con video; **76 sin video**. [Aprobados y evidencia](video-research.json), [pendientes legibles](videos-pending.md), [CSV](videos-pending.csv).
- Se priorizaron cakes de todas las categorías, packs y shells. Las páginas de los enlaces nuevos se abrieron y se contrastaron nombre, marca, código/presentación y disponibilidad del reproductor. No se reprodujo cada video entero ni se garantiza inserción en toda región/navegador.
- La web sigue sin reproductores en cards y carga YouTube sólo tras “Load video”; se comprobó reproducción insertada de Bamboozle, sin autoplay inicial. La app conserva apertura externa.
- [Cuatro cakes sin gramaje confirmado](cakes-pending.md) y [CSV](cakes-pending.csv): Old Ironsides, Light Brigade, 2 Minutes Extravaganza y ahora Mass Confusion. Captain Sam BP2228/30 shots está confirmado como 200g por Brothers. Totales: 38 de 200g, 70 de 500g, 5 packs, 4 pendientes. Ninguna clasificación se dedujo del peso de envío o tamaño visual.
- Los cambios de marca/categoría en una lista guardada requieren revisión explícita. El snapshot anterior y cantidades se conservan, sin sustituir variantes.

## Imágenes

**11 mejoras** a partir de los mismos originales aprobados de alta resolución: Diwali Dazzler, Snow Cone, Eagle Pride, America First, US Power, 3 Min, Ladybugs 3 Pack, Blond Joke, Land of the Free, USA Saturn Missile Battery y No. 3 Cone Fountain 2 Pack. Web hasta 960 px y app hasta 640 px, sin ampliar fuentes pequeñas. Se preservaron encuadre, alfa, márgenes y proporciones. [Fuentes, originales y pendientes](images.md).

No se publicó ninguna imagen generada. La edición de Fountastic se descartó por alterar letras del envase. Hay 25 recursos de menos de 350 px documentados para futuras referencias de mayor calidad; se conservan por fidelidad, con limitación de detalle ampliado. El control de permisos del navegador rechazó descargar la referencia oficial de Fountastic. No se intentó eludir ese rechazo.

## PDF compacto

El renderer compartido no muestra SKU, GTIN, modelo ni descripción. Mantiene nombre, marca escrita, categoría, cantidades, condiciones y agrupaciones. Los identificadores permanecen en los datos. Los nombres que requieren distinguir presentación incorporan sólo un calificador corto y comprensible. Sin fotos, el texto empieza en el margen izquierdo; con fotos, miniaturas de 36 pt y filas desde 44 pt. Sin fotos, filas desde 34 pt. Los nombres largos se ajustan y las tablas continúan con encabezados.

Se generaron y revisaron visualmente las **10 páginas** de estos tres documentos:

- [Lista larga con miniaturas — 4 páginas](../../../output/pdf/iteration-2026-09-25/my-list-with-photos.pdf).
- [La misma lista sin fotos — 3 páginas](../../../output/pdf/iteration-2026-09-25/my-list-no-photos.pdf).
- [Promociones, BOGO y nombre largo — 3 páginas, TEST ONLY](../../../output/pdf/iteration-2026-09-25/promotion-layout-test.pdf). Reglas sintéticas de maquetación; no ofertas comerciales activas.

También se descargó desde la UI y se renderizó [una lista real de navegador sin fotos](../../../output/pdf/iteration-2026-09-25/browser-list-no-photos.pdf): 3 unidades individuales y 2 unidades de una pareja pendiente, sin códigos visibles ni unidades gratis inventadas. Sin cortes, superposiciones o columnas vacías observados. Exportar con fotos desde la UI también terminó correctamente.

## Validación ejecutada

| Verificación | Resultado |
|---|---|
| `npm run catalog:sync` y `catalog:check` | PASS; 302 identidades y paridad por campos, videos, recursos y reglas |
| Web `npm run lint` | PASS |
| Web `npm run test` | 90/90 |
| Web `npm run build` | PASS; 303 rutas de metadatos; `.htaccess` idéntico al origen |
| App `npm run typecheck` | PASS |
| App `npm run lint` | PASS |
| App `npm run test` | 33/33 |
| App `CI=1 npx expo export --platform all --output-dir dist-review-iteration` | PASS; bundles Android, iOS y web; no publicación |
| Navegador web 1440×1000, 768×1024 y 390×844 | PASS en las superficies revisadas; sin overflow horizontal |
| BOGO + Black Cat + Firecrackers + búsqueda 200 | Un resultado; favoritos y agregar funcionan sin abrir ficha |
| BOGO + 500g Cakes | Cero resultados, estado vacío honesto |
| Teclado | Espacio alterna BOGO 8↔302; foco naranja de 3 px visible |
| Persistencia y edición | Recarga conserva favorito y lista de 5 unidades; pareja entre marcas mantiene 2 unidades pendientes |
| Consola del sitio | Sin errores ni warnings en las rutas modificadas revisadas |
| PDFs | 10 páginas de fixtures + PDF descargado de UI renderizados e inspeccionados |
| Movimiento reducido | Revisión de CSS/arquitectura y pruebas existentes; no emulación visual del sistema con reduce activo en esta sesión |

Limitaciones: CoreSimulatorService rechazó la conexión/listado de dispositivos; **no hubo prueba nativa en simulador ni dispositivo**, ni del share sheet nativo. Intentar servir la exportación web de la app en un puerto adicional también fue rechazado por permisos de bind, por lo que su UI no se presenta como revisada en navegador. La exportación y el análisis estático no sustituyen esa validación. El build web avisa por el chunk de miniaturas PDF (cargado bajo demanda); no se agregó dependencia. Node emite el aviso ya existente sobre formato de módulo al ejecutar las pruebas de la app. `.htaccess` se conserva y se verificó su copia; Apache/Hostinger no se ejecutó ni desplegó.

## Vista previa y capturas

Web local: <http://127.0.0.1:5176/> · [BOGO](http://127.0.0.1:5176/products?bogo=1) · [My List](http://127.0.0.1:5176/my-list). La lista de prueba es local a este origen; no afecta la almacenada en otro puerto.

- [Catálogo y BOGO desktop](screenshots/bogo-desktop.png) · [móvil](screenshots/bogo-mobile.png).
- [Ficha 3 Min](screenshots/product-detail-3-min.png).
- [My List desktop](screenshots/my-list-desktop.png) · [tablet](screenshots/my-list-tablet.png) · [móvil](screenshots/my-list-mobile.png) · [vacía](screenshots/my-list-empty.png).
- [Selección BOGO pendiente](screenshots/my-list-bogo-selection.png) · [ofertas 2026 archivadas](screenshots/promotions-archived-desktop.png).
