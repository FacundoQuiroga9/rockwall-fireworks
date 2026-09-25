# Informe histórico: primera ampliación y experiencia de catálogo

**Actualización:** los números de este informe describen la entrega anterior de 50 productos. La continuación actual llegó a **301 productos**, corrigió siete marcas, incorporó Firehawk y dejó **757 filas pendientes**. Consultar [el informe vigente](../continuation-2026-09-24/README.md). Los archivos `reviewed-products.json`, `research-ledger.csv` y `pending-products.csv` de esta carpeta sí contienen el estado actualizado. Skybolt, Big Top y otros casos descritos abajo como pendientes se resolvieron en la continuación; el bloqueo anterior del logo Firehawk también quedó resuelto con el original aportado por el usuario.

La web tiene catálogo independiente en `/products`, 50 detalles con URL estable, filtros combinables de marca/categoría/búsqueda, favoritos locales y video bajo interacción cuando existe. Featured Products continúa como selección de 10 productos en la home. La app incluye el mismo catálogo comercial, filtros de marca simples, información enriquecida y sus favoritos y enlaces externos a videos existentes.

Vista previa local: http://127.0.0.1:5175/products

## Resultado y alcance real de la investigación

| Medida | Cantidad |
| --- | ---: |
| Filas reconciliadas de variantes de Square, antes de esta iteración | 1060 |
| Filas Regular / con variante nombrada | 980 / 80 |
| Nombres distintos en Square, **no** conteo de productos únicos | 963 |
| Productos publicados antes de esta iteración | 35 |
| Productos nuevos identificados e incorporados ahora | 15 |
| Productos publicados en web y app | 50 |
| Productos destacados de la home conservados | 10 |
| Nuevos productos con video exacto verificado / sin video | 14 / 1 |
| Filas de Square pendientes al comenzar / al finalizar | 1028 / 1013 |
| Registros de datos excluidos / nuevas exclusiones | 0 / 0 |

Los 35 IDs anteriores permanecen intactos. Los 15 nuevos corresponden a 15 filas distintas de Square. La conciliación anterior resolvió 32 identidades de Square; ahora son 47. Hay tres productos históricos conservados cuyo vínculo exacto con Square todavía no está resuelto. No se sumaron el CSV y el Excel como inventarios independientes; se reutilizó su conciliación existente. Dos filas vacías de disposición del Excel ya estaban documentadas como excluidas del inventario, no como productos eliminados.

Se realizó una primera búsqueda de código/nombre para 906 filas pendientes y una comparación con la referencia oficial Winco para otras 122. Un resultado de buscador o una coincidencia en ese documento histórico no se considera una aprobación. Se revisaron por separado modelos, envases y presentaciones de los lotes incorporados. La investigación **no está completamente cerrada**: todavía hay candidatos que requieren contrastar presentación y obtener recursos exactos.

Los 1013 registros restantes se separan así:

| Estado | Filas | Interpretación |
| --- | ---: | --- |
| Sin identidad verificada | 558 | La primera búsqueda no aporta evidencia suficiente; no equivale a demostrar que el producto no existe. |
| Candidato que requiere revisión de envase/presentación | 438 | Hay fuentes candidatas, pero todavía no una aprobación individual completa. |
| Identificado, falta una imagen adecuada | 8 | No se usó una foto de otra variante ni una generación infiel. |
| Conflicto de datos o variantes | 5 | El código, la presentación o el recurso no concuerdan. |
| Presentación pendiente | 2 | No se puede inferir qué contiene la unidad vendida. |
| Identidad pendiente de revisión específica | 2 | Nombre genérico o código alternativo insuficiente. |

Estos son conteos de **filas/variantes**, no 1013 productos únicos. No sería correcto deduplicarlos por nombre sin más evidencia. Cada fila conserva token, SKU/GTIN, nombre original, variante y procedencia del CSV/Excel, además de consulta, fuentes, motivo y siguiente paso.

## Incorporaciones

| Producto | Marca / modelo | Presentación |
| --- | --- | --- |
| Bump Bear | Winda P5011 | 200 g, 16 shots |
| Fun Fuel | Winda P5191 | 200 g, 50 shots |
| Military Parachute | Winda P5083 | 2 piezas |
| Princess Parachute | Winda P5089 | 2 piezas |
| Double Dragon | Winda P8044 | 6 shells de 6 pulgadas |
| Diwali Dazzler | Winda P0038 | Assortment P0038; sin video verificado |
| Snow Cone | Winda P3088 | Fuente de tamaño completo |
| Eagle Pride | Raccoon RA530120 | 500 g, 30 shots |
| America First | Raccoon RA53064 | 500 g, 24 shots |
| U.S. Power | Raccoon RA22534 | 200 g, 16 shots |
| 3 Min | Monkey Mania MM-F1808 | Fuente MM-F1808 |
| Ladybugs | Brothers BP5035 | 3 piezas |
| Blond Joke | Brothers BP2975 | 500 g, 36 shots |
| Land of the Free | Monkey Mania MM40002 | 36 shells, 54 breaks |
| USA Saturn Missile Battery | Brothers BP2324 | 297 shots |

La evidencia individual, fuentes y videos están en [reviewed-products.json](reviewed-products.json) y el resumen de enlaces en [sources.md](sources.md). Las fotografías originales inspeccionadas están en [references](references/). Todas las imágenes finales se copiaron dentro de Rockwall; no existe dependencia de runtime hacia Dynamite o carpetas temporales.

No se importaron precios, stock, promociones, checkout, listas de compra ni afirmaciones de disponibilidad de terceros. El texto comercial aclara que la selección puede variar. Las descripciones técnicas nuevas se limitaron a datos corroborados.

## Decisiones de fidelidad

- Fun Fuel: se rechazó el video de Dynamite `2TOGoHWtoaw`, que era Colonel Popper P5586. Se incorporó una demostración oficial de P5191.
- America First: la propia página del fabricante enlazaba `CsjKGeSACIU`, cuyo título identifica RA53064C, envase compacto. Se reemplazó por `AoL13E3J2G8`, de American Wholesale, con RA53064 explícito y vinculado al mismo UPC.
- Snow Cone P3088, Snow Cone Jr. P3097 y Hand Held Snow Cone P3213 son productos/presentaciones distintos. Las fotos de uno no completan los otros.
- Skybolt: el UPC de Square identifica Brothers BP1217, cinco cohetes con varilla. La fotografía de Dynamite es un misil Firehawk con aletas; quedó pendiente.
- Se conservan separados los dos Festival Balls existentes y las demás filas homónimas sin coincidencia probada.
- El segundo Diwali Dazzler, el Military Parachute sin código, RDXplosion, Big Top y Green Fuse conservan sus incertidumbres/conflictos. Consultar los CSV; no se inventaron sustituciones.
- Los seis colores de Jumbo Neon Smoke Ball en una foto no demuestran que Square venda un paquete de seis. Dino Eggsplosion también requiere verificar el contenido exacto de la unidad.

Se hicieron dos ediciones con Imagegen, después de inspeccionar sus referencias. **Ambas se rechazaron**: Bump Bear alteraba texto del envase; Da Big Box O’ Bombs cambiaba códigos de modelo. La decisión está en [image-review.json](image-review.json). No se integró ninguna imagen generada incorrecta. Se conservaron fotos reales con transparencia, optimizando sólo tamaño y formato. Los 50 recursos de tarjetas tienen canal alfa real; las 15 imágenes principales nuevas suman aproximadamente 599 KiB, además de sus versiones responsivas. Algunas referencias tienen resolución limitada y no se ampliaron artificialmente para inventar detalle.

La revisión automática rechazó por permisos la descarga de imágenes de Winda y del logo oficial de Firehawk. No se intentó eludir esos bloqueos. Firehawk se muestra como nombre, y las imágenes que faltan siguen pendientes. El logo oficial localizado para futura adquisición es https://www.firehawkfireworks.com/images/aboutus/brands/logo-FB.png, publicado en el sitio del fabricante.

## Interfaz y mantenimiento

La navbar usa Home, Products, About, Contact y Mobile App. About/Contact funcionan desde catálogo y detalles. `/#catalog` sigue siendo compatible y lleva a `/products`; `/#featured-products` conserva su sección en la home.

Las marcas reutilizan logos locales auténticos, con nombres accesibles y selección visible. El catálogo combina filtros, conserva su estado en la URL, ofrece limpiar filtros y carga 12 tarjetas por lote con imágenes diferidas. Las tarjetas comparten dimensiones; fondo y rotación breve responden a hover/foco sin esconder acciones. No volvió el spotlight.

Cada detalle tiene canonical, título y metadatos propios. El build genera 51 documentos de metadatos de catálogo/detalle para Apache/Hostinger y actualiza el sitemap. React sigue siendo el framework existente; no se agregó backend. El reproductor YouTube nocookie se crea sólo al pulsar Load video y no tiene autoplay. Siempre hay un enlace externo de respaldo; los productos sin video no muestran ese bloque.

Los favoritos web se guardan por ID en ese navegador. Los favoritos de la app conservan su clave e IDs; no hay cuentas ni sincronización entre plataformas.

La fuente maestra y el procedimiento repetible están en [la guía de mantenimiento](../README.md). `npm run catalog:sync` genera los archivos de la app; `npm run catalog:check` compara datos reales y recursos por identificador. Se ejecutó después de los lotes y al finalizar: **PASS, 50 productos / 50 identidades de imagen**.

## Archivos de entrega

- [Inventario maestro conciliado de Square](../2026-08-square/inventory-master.csv), conservado como evidencia histórica.
- [Registro de investigación](research-ledger.csv), con las 1028 filas iniciales y sus resultados.
- [Pendientes reutilizables](pending-products.csv), 1013 filas.
- [Identificados sin imagen adecuada](identified-missing-images.csv) y [conflictos revisados](conflicts.csv).
- [Revisiones manuales pendientes](pending-reviews.json), [índice de consultas y fuentes](research-index.json) y [resumen numérico](research-summary.json).
- [Validación y limitaciones](VALIDATION.md), [control de paridad](parity-result.json) y [capturas](screenshots/).

La home, el hero de Dallas, la imagen aprobada de plataforma/productos, temporadas, contacto y promociones se conservaron. Sus archivos coinciden con el baseline tomado antes de esta tarea. También se verificaron los hashes de los dos originales de Square y de los catálogos fuente de Dynamite: sin cambios. Todo queda local, sin push, despliegue ni publicación de la app.
