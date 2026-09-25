# Mantener alineados los catálogos

> Actualización 2026-09-25: la [revisión de categorías e interfaz](refinement-2026-09-25/README.md) resuelve 28 de las 31 cakes pendientes e incorpora home, filtro BOGO y guía My List. Este informe anterior conserva la evidencia histórica; consultar la revisión nueva para los totales vigentes.


La fuente comercial publicada es `src/data/products.json` en la web. La app recibe archivos generados y recursos propios; no importa código ni archivos del repositorio hermano durante su ejecución.

Estado actual: **302 productos**. Ver [presentación y auditoría actual](presentation-2026-09/README.md), [revisión de identificados](presentation-2026-09/identified-review.csv) y [756 filas/variantes pendientes](enrichment-2026-09/pending-products.csv). Los informes anteriores son históricos; las filas no equivalen a productos únicos.

Iteración My List: [informe, evidencia y pendientes](my-list-2026-09/README.md) y [reglas registradas antes del motor](my-list-2026-09/RULES.md). Incluye categorías 200g/500g, marca BOGO de origen (vigencia pendiente), Silent Treatment → Fox, listas locales y PDF. Las promociones de 2025 se conservan desactivadas como archivo.

Desde `rockwall-fireworks`:

```sh
npm run catalog:sync
npm run catalog:check
npm run lint
npm run test
npm run build
```

Desde `rockwall-fireworks-mobile`:

```sh
npm run typecheck
npm run lint
npm run test
```

`catalog:sync` genera `src/data/products.ts`, `src/types/product.ts`, `src/data/productImages.ts` y el snapshot de auditoría de la app; también actualiza el sitemap web. `catalog:check` lee los archivos reales de ambos proyectos y compara cada ID, nombre, marca, categoría, presentación, descripción, características, modelo, condición de destacado, orden y video opcional. Comprueba además la asociación y SHA-256 de las imágenes locales/responsivas contra `asset-identities.json`, slugs únicos y sitemap. Una cantidad total igual no alcanza para aprobar.

Antes de agregar un producto:

1. Vincularlo con una fila/variante de Square y documentar fabricante, modelo y presentación con evidencia. Los SKU internos y los nombres similares no confirman identidad por sí solos.
2. Conservar un ID permanente. El slug sirve para navegar; nunca reemplaza el ID usado por favoritos. Los 50 IDs anteriores a la continuación siguen intactos.
3. Guardar la fotografía real de referencia, comprobar visualmente el envase y preparar recursos locales para cada proyecto. Registrar su identidad, origen y hashes en `asset-identities.json`. Las diferencias de formato/tamaño son válidas; otro envase o variante no lo es.
4. Completar solamente información verificada en el maestro. Omitir video cuando no haya una demostración exacta. No importar precios/stock/promociones de terceros. Los nuevos productos no son destacados automáticamente.
5. Ejecutar sync, check y las pruebas de ambos proyectos después de cada lote. Revisar catálogo/detalle en navegador y la app en un dispositivo o simulador.

Las aprobaciones están en `enrichment-2026-09/reviewed-products.json`. `python3 scripts/catalog/import_enrichment.py --dynamite /ruta/al/proyecto --ids id-aprobado-1 id-aprobado-2` importa **sólo el lote indicado**; requiere Pillow y verifica el hash de la referencia aprobada. Usar `--ids` para no reprocesar fotografías anteriores innecesariamente. Acepta referencias locales con procedencia y SHA-256 registrados; Dynamite permanece de sólo lectura. No clasifica búsquedas como productos publicables. Los recursos nuevos son WebP con alfa real, hasta 640 px, y variantes web de 320/480 px sin ampliar fuentes pequeñas. Los PNG anteriores de la app se conservan; el mapa generado usa el formato declarado por cada identidad de imagen.

Las correcciones confirmadas por el usuario viven en `manual-corrections.json`. Cada corrección fija ID, nombre, imagen aprobada y marca canónica; `catalog:sync` la aplica al maestro **antes** de generar la app y falla si cambia la identidad protegida. `catalog:check` detecta un maestro que perdió la corrección. No corregir sólo un archivo generado ni identificar variantes por nombre. Festival Balls Artillery (Black Cat) y Festival Balls Reloadable (Monkey Mania) continúan separados.

`python3 scripts/catalog/research_ledger.py` recompone el registro y CSV de pendientes desde el índice de búsquedas versionado, la comparación Winco, las aprobaciones y `continuation-2026-09-24/row-decisions.json`. Comprueba los tokens de Square y distingue duplicados/exclusiones de productos publicados. No necesita repetir búsquedas ni disponer de los caches temporales. Rechaza entradas faltantes antes de sobrescribir los informes. Las escrituras de sincronización y CSV usan archivos temporales para preservar la última versión completa si falta espacio.

Los CSV usan UTF-8 con BOM y campos entrecomillados. Importar las columnas SKU/GTIN/token como **texto** en Excel para evitar que Excel quite ceros iniciales o use notación científica.

La conciliación original de agosto se conserva en `2026-08-square/`. Su importador `import_confirmed.py` está retirado para impedir que vuelva a sobrescribir el catálogo enriquecido. El inventario histórico es evidencia de pertenencia, no disponibilidad actual.

Favoritos web: `rockwall:favorites:v1`, locales al navegador. Favoritos app: `@rockwall-fireworks/favorites:v1`, locales al dispositivo. No hay sincronización entre ambas aplicaciones.

My List usa claves independientes `rockwall:my-list:v1` y `@rockwall-fireworks/my-list:v1`. `/my-list` es una lista para llevar a tienda, sin pedido ni reserva. `src/shared/myList.js` y `listPdf.js` son canónicos; sync copia sus declaraciones y módulos sin modificarlos a la app. También sincroniza `promotions.json`, logos y miniaturas de impresión; check verifica sus bytes. No editar esas copias generadas en la app.

`my-list-2026-09/commercial-review.json` mantiene las correcciones comerciales por identidad; sync las aplica después de las correcciones previas. `python3 scripts/catalog/review_commerce.py` recompone esa revisión desde la evidencia conciliada y el baseline preservado; revisar manualmente una fuente nueva antes de adoptarla. Los precios históricos no son precios actuales. Para activar una oferta, registrar elegibilidad exacta, revisión, fechas o vigencia abierta explícita, límites, compatibilidad y criterio de unidad gratis confirmado; no basta con cambiar `status`.

Tras cambiar una fotografía aprobada, regenerar sólo los derivados de impresión con `python3 scripts/catalog/prepare_pdf_thumbnails.py` y ejecutar sync/check. El script no modifica productos. `node scripts/catalog/pdf-examples.mjs` genera ejemplos reales en `output/pdf/`; el archivo `promotion-layout-test.pdf` usa reglas sintéticas marcadas TEST ONLY y no valida condiciones comerciales.

Rutas web: `/products` y `/products/:slug`. `/#catalog` redirige al catálogo; `/#featured-products` continúa en la home. `.htaccess` conserva archivos reales y reescribe rutas SPA a `index.html` sin redirección; recursos inexistentes devuelven 404. El build incluye `dist/.htaccess`. Los HTML de `catalog-pages/` siguen generándose, pero ya no son el destino de estas reglas. React mantiene títulos/canonical; los previews sin JavaScript requieren validación/estrategia de metadatos de servidor. Ver las limitaciones en el informe actual. No se desplegó nada.

Para reencuadrar recursos desde originales preservados: `npm run catalog:frame -- --ids id-del-producto` y luego sync/check. La política central está en `presentation-2026-09/framing-policy.json`. Las correcciones editoriales persistentes están en `presentation-2026-09/commercial-copy-review.json`; sync las aplica antes de generar la app y check detecta su pérdida.
