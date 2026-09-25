# Conciliación del catálogo Rockwall — 24 de septiembre de 2026

Se incorporaron **25 productos nuevos** en web y app: ambos catálogos contienen **35 productos**, de los cuales **10 siguen siendo destacados**. No se modificaron los IDs, fotos ni videos de los diez existentes. La imagen integrada de productos, el skyline, temporadas, promociones y enlaces de publicación permanecen intactos.

## Fuentes y conciliación

- Square CSV: `MLTX6DPJDFYX7_catalog-2026-08-16-1724.csv`, 1.060 filas de datos, además del encabezado.
- Square Excel: `rockwall fireworks items.xlsx`; `Items` contiene las mismas 1.060 variantes (filas 3–1062). `Component Inventory` sólo contiene su encabezado; no hay inventario adicional.
- Dynamite: `/Users/facundoquiroga/code/FacundoQuiroga9/dynamite-fireworks`, `public/products.json` (193 entradas), `public/gender-reveal.json` (4 entradas) e imágenes `public/products/`. El carrusel y la página de catálogo usan el mismo JSON; no constituyen inventarios adicionales. El proyecto API hermano no aporta otro catálogo.

Se compararon **todos los campos comunes por Token**, no por posición ni nombre. No hay diferencias sustantivas ni tokens exclusivos de una fuente. Excel agrega `Reference Handle`, conservado en el maestro. La lectura tipada del Excel presenta 1.052 precios sin los ceros decimales del CSV; el XML conserva las mismas representaciones originales. Son diferencias de visualización numérica, no precios contradictorios. No se publica ningún precio, stock ni promoción de estas fuentes.

`Token` identifica una fila de variante. Ningún archivo proporciona un ID padre inequívoco con el que resolver todos los productos físicos. Los SKU se conservan como cadenas: no se usan como prueba entre tiendas. Dynamite no incluye UPC/GTIN ni códigos de fabricante estructurados, y sus descripciones están vacías. No se inventaron descripciones ni se afirmó una coincidencia de barcode. Se buscaron candidatos por nombre y se revisaron sus envases, marcas, categorías y presentaciones; sólo `reviewed-matches.json` autoriza una incorporación. Una coincidencia de nombre sin evidencia adicional queda pendiente.

La normalización conserva nombres originales, variantes y especificaciones. Limpia espacios; retira el marcador histórico BOGO del nombre de revisión y deja constancia del cambio. Las abreviaturas dudosas permanecen intactas. En los productos revisados, el nombre comercial y la presentación se separan sin perder medidas, disparos o cantidad. `Unknown` significa desconocido; SKU/GTIN vacíos significan que el export no los proporciona.

La columna `csv_row` numera registros lógicos contando el encabezado como fila 1. Como el CSV contiene campos con saltos de línea, `csv_line_start` y `csv_line_end` conservan además las líneas físicas del archivo. Los índices de Dynamite son base cero y se acompañan de nombre, ruta y hash; no son IDs comerciales.

Se comprobaron los 197 recursos referenciados por ambos JSON. Las otras dos imágenes de esa carpeta (`height-of-fashion.png` y `roman-candle-poly-pack copy.png`) no justifican nuevas incorporaciones: no hay un producto Square inequívoco correspondiente y una es una copia de recurso.

## Conteos sin mezclar filas y productos

| Medida | Resultado |
| --- | ---: |
| Filas originales CSV / filas de datos Excel | 1.060 / 1.060, **las mismas** |
| Variantes reconciliadas por Token | 1.060 |
| Filas con variante `Regular` / variante nombrada | 980 / 80 |
| Nombres de ítem diferentes en Square | 963; no equivalen a productos físicos confirmados |
| Grupos con nombre repetido | 67 |
| Grupos de SKU repetidos | 4 (8 filas), sin fusionar automáticamente |
| Productos únicos identificados inequívocamente en Square | 32 |
| Coincidencias confirmadas con Dynamite | 28 productos: 25 nuevos + 3 ya existentes |
| Otros productos existentes conciliados con su foto aprobada | 4 |
| Productos existentes preservados | 10; 7 conciliados y 3 conservados con relación a Square pendiente |
| Productos nuevos incorporados / catálogo final | 25 / 35 |
| Registros de variante pendientes | 1.028 |
| Pendientes sin coincidencia específica | 940 registros |
| Coincidencias probables | 73 registros de variante |
| Conflictos | 15 registros de variante |
| Identidades confirmadas pendientes sólo por falta de recurso indispensable | 0 |
| Registros de datos eliminados o fusionados | 0 |
| Filas vacías excluidas | 2 filas de formato del Excel, una al inicio de cada hoja |

**El total de productos físicos únicos de todo Square todavía no puede afirmarse.** Los 1.028 pendientes son variantes/identificadores por revisar, no 1.028 productos necesariamente distintos. No se suman los dos exports. Los tres existentes sin vinculación inequívoca son Alien Attack (dos SKU posibles), Night Rider (Square dice Knight Rider/Fiesta) y Festival Balls Artillery (marca/variante por corroborar). Se preservan y se evita crearles duplicados.

## Decisiones y conflictos importantes

- **Festival Balls:** sólo la fila Monkey Mania, 6 piezas, caja amarilla se relacionó con `festival-balls-reloadable`. Boomer azul, Boomer rojo/negro y World Class negro no se fusionaron.
- **Neon Diablo:** se incorporó Black Cat de 5 pulgadas, 24 unidades. La fila de 6 unidades no utiliza la foto del pack de 24.
- **RDXplosion:** el nombre de Square dice 6 pulgadas, pero la categoría y el envase muestran 1,75 pulgadas. Puede tratarse de longitud/calibre o un error; queda pendiente de aclaración.
- **Armed Forces:** hay generaciones distintas; el JSON de Dynamite dice Raccoon, pero la foto lleva World Class. No se importó.
- **Skybolt:** cinco varillas en Square frente a un misil de base propia en la foto; no se importó.
- **Diwali Dazzler:** dos SKU bajo el mismo nombre, sin datos suficientes para distinguir las presentaciones.
- **Handheld Snowcone:** no se confundió una unidad/color con el exhibidor multipieza de la fuente.
- Dos filas con nombre de lámparas LED para automóvil tienen categorías/variantes de velas romanas. Se conservaron como conflicto de datos, no se descartaron como productos definitivamente ajenos al negocio.
- Los cuatro SKU repetidos se listan en `duplicate-skus.csv`. Un mismo SKU no justifica borrar variantes ni asumir que los nombres son sinónimos.
- Las fotos seleccionadas se revisaron visualmente sin detectar branding ni marcas de agua de Dynamite. Se conservaron envases y composición: sólo se redujo resolución y se cambió codificación, sin generar imágenes ni ampliar artificialmente fuentes pequeñas.

## Archivos

- `inventory-master.csv`: una fila por Token, nombres originales y normalizados, SKU/GTIN, marca, categorías, presentación, especificaciones reconocibles, procedencia de ambos archivos y hoja/fila, coincidencia y evidencia.
- `matches-and-evidence.csv`: estado de cada registro y candidatos de Dynamite, identificados por archivo, índice, nombre, marca e imagen. `existing_rockwall` distingue una relación con un producto preexistente de una importación desde Dynamite.
- `pending-products.csv`: lista reutilizable con 1.028 variantes, motivo, candidatos y datos faltantes; `pending_group` separa `no_match`, `probable` y `conflict`.
- `pending-missing-assets.csv`: grupo separado, actualmente vacío. Los videos son opcionales; Let's Celebrate tiene foto confirmada pero la fuente no ofrece video.
- `excluded-records.csv`, `duplicate-skus.csv`: excepciones y duplicados señalados, sin pérdida de trazabilidad.
- `reviewed-matches.json`: 28 decisiones manuales y hashes de las fotos fuente.
- `asset-provenance.json`: 25 conjuntos nuevos, rutas y hashes, tamaños, dimensiones y 24 videos provenientes de las entradas correspondientes.
- `preserved-catalog.json`: IDs, metadatos y hashes originales para comprobar preservación.
- `summary.json`: conteos y SHA-256 de los archivos fuente.

Los CSV son UTF-8 con BOM, comillas escapadas y campos entrecomillados. **Importarlos en Excel usando tipo Texto para Token, SKU, GTIN y Reference Handle**: abrir un CSV con doble clic puede hacer que Excel elimine ceros iniciales aunque el archivo los conserve. No se antepusieron fórmulas ni apóstrofos a los valores originales.

## Integración y mantenimiento

La web mantiene el carrusel Featured separado y ofrece `/#catalog`, con búsqueda por nombre/marca/presentación, categorías y ocho tarjetas iniciales. Las fotos usan carga diferida y variantes WebP de hasta 320/480/640 px, sin upscale; los descriptores `srcset` reflejan el ancho real. Los recursos web nuevos suman aproximadamente 1,90 MB **entre todas las variantes**, sin descargarse todos al inicio.

La app mantiene su catálogo TypeScript, IDs tipados y mapa estático de imágenes, sin importar archivos del repositorio web en runtime. Sus 25 PNG nuevos suman aproximadamente 4,14 MB. Explore usa FlatList con lotes de ocho, búsqueda ampliada y las categorías existentes/nuevas; el detalle existente muestra marca y presentación conocidas. Favoritos conserva `@rockwall-fireworks/favorites:v1` y todos los IDs originales. No se implementaron páginas nuevas, checkout, listas de compra, PDF, playground ni configuración de promociones.

Reproducir desde la web (Python 3; Pillow sólo para optimizar recursos):

```sh
python3 scripts/catalog/reconcile.py \
  --csv '/Volumes/FACUNDO/Rockwall fireworks/MLTX6DPJDFYX7_catalog-2026-08-16-1724.csv' \
  --xlsx '/Volumes/FACUNDO/Rockwall fireworks/rockwall fireworks items.xlsx' \
  --dynamite /Users/facundoquiroga/code/FacundoQuiroga9/dynamite-fireworks
python3 scripts/catalog/import_confirmed.py \
  --dynamite /Users/facundoquiroga/code/FacundoQuiroga9/dynamite-fireworks \
  --mobile ../rockwall-fireworks-mobile
python3 -B -m unittest discover -s scripts/catalog -p 'test_*.py' -v
```

La conciliación aborta si aparece una contradicción sustantiva entre fuentes. El importador exige Token/nombre/imagen/hash revisados; **no convierte candidatos en productos automáticamente**. Revisar nuevas decisiones antes de incorporarlas al manifiesto. Los proyectos finales funcionan sin Dynamite ni el volumen de Square.

## Validación

Ver `VALIDATION.md` para resultados, capturas y limitaciones del entorno. Vista previa web de desarrollo: http://127.0.0.1:5175/#catalog. Los cambios quedan locales, sin push ni publicación.
