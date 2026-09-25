# Continuación del catálogo — 24 septiembre 2026

Web y app comparten **301 productos**, frente a 50 al iniciar esta tarea. Se incorporaron **251 productos en siete lotes**, se corrigieron siete marcas y se integró el logo original de Firehawk. La investigación **no equivale a un catálogo completo**: quedan 757 filas/variantes con causas y pasos concretos registrados.

Vista previa de desarrollo: <http://127.0.0.1:5175/products?brand=Firehawk>. Todos los cambios son locales; sin push, despliegue ni publicación de la app.

## Conteos sin confundir filas con productos

| Medida | Resultado |
| --- | ---: |
| Filas conciliadas originales de Square | 1060 |
| Filas Regular / variantes nombradas originales | 980 / 80 |
| Nombres distintos originales, no productos únicos | 963 |
| Productos iniciales / finales publicados | 50 / 301 |
| Productos nuevos | 251 |
| Productos existentes enriquecidos con marca | 7 |
| Destacados de la home conservados | 10 |
| Nuevos con video exacto / sin video aprobado | 112 / 139 |
| Catálogo final con video / sin video | 158 / 143 |
| Filas pendientes iniciales / finales | 1013 / 757 |
| Filas incorporadas como identidad principal | 251 |
| Filas duplicadas separadas | 4 |
| Filas excluidas de publicación | 1 |
| Identidades comerciales de Square confirmadas acumuladas | 298 |
| IDs históricos conservados sin vínculo exacto con Square resuelto | 3 |

Los 251 productos nuevos se vinculan a 253 filas de Square: dos filas adicionales son duplicados de productos incorporados. Otros dos duplicados apuntan a registros cuya identidad sigue pendiente. No hay nuevas vinculaciones a los 50 productos iniciales sin evidencia suficiente. La cuenta de 298 identidades Square y tres IDs históricos explica los 301 productos publicados; no afirma que el inventario completo tenga sólo 301 identidades.

Las 757 filas restantes contienen 678 nombres normalizados distintos. **Tampoco son 678 productos únicos**: persisten paquetes, homónimos y variantes sin resolver. No se fusionaron por semejanza. La presencia histórica en Square no representa stock actual.

## Marcas y Firehawk

Correcciones persistentes en [manual-corrections.json](../manual-corrections.json), aplicadas por `catalog:sync` antes de generar la app:

| ID estable | Marca canónica |
| --- | --- |
| alien-attack | Happy Family |
| festival-balls-artillery | Black Cat |
| futurama-artillery | Raccoon |
| neon-beef | Winda |
| night-rider | Monkey Mania |
| star-light | Winda |
| the-reaper | Raccoon |

El otro Festival Balls, `festival-balls-reloadable`, conserva Monkey Mania. Las reglas comprueban ID, nombre y fotografía antes de aplicar la marca; no sobreescriben otras presentaciones por compartir nombre. Los siete cambios aparecen en maestro, filtros, tarjetas/detalles y app después de volver a sincronizar.

El PNG original `public/images/brands/firehawk logo.png` se conserva. Se prepararon WebP de 320 y 160 px sin regenerarlo; su alfa, colores y proporciones se mantuvieron. El ID de marca es `firehawk`, su nombre comercial en productos es `Firehawk` y el logo se usa en el selector y en la home. Tres productos corresponden a esta marca, incluido el nuevo Flag Missile Battery de 200 disparos. La home distribuye sus 11 logos en una fila de escritorio, 6+5 en tablet y 4+4+3 en móvil.

## Investigación y lotes

Se reutilizó el inventario conciliado CSV/Excel y el estado guardado. Dynamite y Square permanecieron de sólo lectura. El volumen externo con los originales de Square no estaba montado en esta continuación; no se afirma haber vuelto a contrastar sus bytes. Se trabajó sobre sus filas, tokens y procedencia ya conservados.

Se retomaron las 1013 filas con búsquedas de código y nombre/presentación, referencias locales de Dynamite, índices de fabricante y comprobaciones de imágenes. Se consultaron los catálogos públicos de Raccoon/Monkey Mania, Brothers y Winco y fuentes comerciales adicionales cuando aportaban un código de producto y presentación verificables. Los índices completos de proveedores sirven para investigar candidatos; **no fueron importados íntegramente**.

| Lote de aprobación | Productos |
| --- | ---: |
| official-1 | 48 |
| official-2 | 45 |
| supplier-3 | 66 |
| official-4 | 17 |
| reviewed-5 | 64 |
| supplier-6 | 8 |
| official-7 | 3 |

Cada lote aprobado pasó `catalog:sync` y `catalog:check`. El registro individual de los 251 productos contiene fila/token de Square, código de identidad, marca, categoría, presentación, fuente, imagen original, hash y decisión de video: [products-added.csv](products-added.csv). Las aprobaciones ejecutables siguen en la fuente existente [reviewed-products.json](../enrichment-2026-09/reviewed-products.json), no en un segundo catálogo paralelo.

De los **438 candidatos iniciales**: 221 terminaron incorporados como registros principales, dos duplicados, 101 requieren revisión de envase, 37 requieren confirmación de identidad, 33 no alcanzaron una identidad verificada, 16 presentan conflicto, 15 requieren aclarar la unidad/paquete y 13 carecen de imagen adecuada. Todos tienen un resultado guardado. Esto no significa que 438 coincidencias hayan sido confirmadas visualmente.

## Decisiones de identidad y recursos

- Se conservan separados Wildcard y American Wildcard; también nombres genéricos de Festival Balls, M-150/M-5000, sparklers y distintos paquetes de Party Pack. Un SKU interno compartido no decide identidad entre comercios.
- Se resolvieron Skybolt con el paquete Brothers de cinco cohetes, Big Top con su presentación correcta de 42 disparos y Mechanical Bug con la foto correcta, rechazando los recursos anteriores de otro producto.
- Arms Depot, Break the Rules y otros Raccoon se verificaron como generaciones/presentaciones concretas. Las versiones compactas con sufijo C no sustituyen automáticamente a las anteriores. Freedom Rider y otros casos sin cruce exacto de código continúan pendientes.
- Se corrigieron contradicciones de terceros con fuentes de fabricante: Major Mojo y Stars and Stripes son World-Class; Festival Fountain pertenece a Black Cat; America Enduring es una fuente. Se omitieron especificaciones contradictorias, como el gramaje de Old Ironsides, el código atribuido a CEO y la supuesta cantidad de disparos por caja de Super Cakes.
- Cuatro duplicados: filas 62→59 (2 Minute Bomb), 1040→662 (Party Animal), 265→264 y 786→36 (baterías Saturn cuya identidad principal sigue pendiente). Se conservan los tokens originales. No se fusionaron otras filas de sparklers/conos con presentación insuficiente.
- Fila 91: el nombre literal identifica luces LED automotrices; se excluyó de publicación, conservando el registro. La fila 92 tiene datos contradictorios de variante y permanece como conflicto, sin extender automáticamente esa exclusión.
- Se rechazaron imágenes con marcas de agua ajenas, presentaciones incorrectas, grupos de variantes o productos cortados. El 1000 Roll Black Cat se resolvió después con una foto individual correcta. El Morning Glory World-Class de 36 pulgadas sigue pendiente de foto completa.
- Una edición Imagegen de Snow Cone Jr. alteró letras/logotipo y advertencias del envase: **rechazada**. Se utilizó la fotografía real exacta de la bandeja de cuatro. No se integró ninguna generación que cambiara packaging. Ver [image-review.json](image-review.json) y [rechazos de recursos](rejected-image-candidates.json).

Se inspeccionaron las fotografías de referencia y los recursos de los lotes. Las imágenes publicadas tienen alfa real, producto completo, tamaño máximo de 640 px y versiones web responsivas. No se amplían fuentes pequeñas para inventar detalle. Algunas fotografías originales tienen resolución limitada; eso continúa siendo una limitación visual real.

Los 50 recursos anteriores de la app y 170 archivos anteriores de imágenes web/productos/hero conservan sus hashes, registrados en [preserved-resources.json](preserved-resources.json). Las 251 imágenes nuevas de la app usan WebP en `expo-image`; los PNG anteriores no cambiaron. [resource-audit.json](resource-audit.json) registra dimensiones, peso y alfa de las 301 identidades. No hay dependencia de carpetas temporales o del proyecto Dynamite durante la ejecución.

Los videos nuevos proceden de páginas exactas y comprobaciones de nombre/modelo/presentación, canal y metadatos de YouTube. Se rechazaron demos de productos parecidos y enlaces genéricos de pie de página. Hay [decisiones específicas](video-decisions.json) y evidencia en cada aprobación. **No se reprodujeron íntegramente los 112 videos nuevos**; se verificó además en navegador la carga bajo interacción de un reproductor representativo. Las ausencias de video son deliberadas y no generan promesas ni bloques vacíos.

## Pendientes concretos

| Motivo | Filas |
| --- | ---: |
| Sin identidad verificada tras búsqueda de código/nombre | 278 |
| Candidato nominal/modelo sin cruce externo suficiente con Square | 307 |
| Candidato cuyo envase/variante todavía no pudo confirmarse | 103 |
| Conflicto entre código, nombre, marca o variante | 29 |
| Presentación o cantidad de la unidad de venta sin resolver | 21 |
| Identidad identificada, falta fotografía exacta y utilizable | 19 |
| **Total** | **757** |

No se declara que esos productos no existan. La información disponible no permite publicarlos con fidelidad suficiente. [pending-products.csv](../enrichment-2026-09/pending-products.csv) conserva nombre original/limpio, SKU/GTIN como texto, token, variante, procedencia, candidatos, consultas, fuentes, motivo y dato/recurso faltante. Las causas de descarga, enlaces caídos, imagen recortada o marca de agua quedan individualizadas cuando corresponden. En muchos casos el siguiente dato útil es una fotografía del envase real de Rockwall y su código legible; en otros falta aclarar si se vende caja, bolsa o unidad.

## Archivos y continuidad

- [Estado inicial inmutable](initial-pending.csv), [decisiones por fila](row-decisions.json) y [resultado CSV de las 1013 filas](row-outcomes.csv).
- [Resumen numérico](summary.json), [productos incorporados](products-added.csv), [índice de fuentes](source-index.json), [búsquedas nominales](name-research-index.json) y [contrastes adicionales](corroboration-index.json).
- [Inventario maestro histórico](../2026-08-square/inventory-master.csv), [registro acumulado de investigación](../enrichment-2026-09/research-ledger.csv), [pendientes sin imagen](../enrichment-2026-09/identified-missing-images.csv) y [conflictos](../enrichment-2026-09/conflicts.csv).
- [Validación actual](VALIDATION.md) y [capturas](screenshots/).

Los CSV usan UTF-8 con BOM, comillas y valores originales de identificadores. Importar SKU/GTIN/token como **texto** en Excel para conservar ceros iniciales. Para continuar, consultar el resultado por fila y no repetir consultas que ya carecen de evidencia; agregar una aprobación sólo después de resolver su causa. Recompilar el registro con `python3 scripts/catalog/research_ledger.py`, importar sólo los IDs del nuevo lote y ejecutar `npm run catalog:sync` y `npm run catalog:check`. La [guía de mantenimiento](../README.md) explica las fuentes y comandos de ambos proyectos.

Se preservaron diseño, rutas, favoritos, hero, temporadas, contacto, promociones e integración de la app. No se incorporaron precios, stock ni funciones comerciales nuevas.
