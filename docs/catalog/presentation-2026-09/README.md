# Presentación y calidad del catálogo — 24 de septiembre de 2026

Esta iteración parte de 301 productos publicados y termina con **302 IDs comerciales** equivalentes en web y app. Conserva los 301 IDs anteriores, los favoritos, los diez productos destacados y sus fotografías aprobadas, el hero de Dallas, las temporadas y el resto de las rutas. No hubo push, despliegue ni publicación de la app.

## Resultados y fuentes

- **Una incorporación:** `party-sparklers-4-pack`, Winda P9012, UPC `705108901203`, fila Square 1042. Es distinta del display ya publicado (`705108901210`, fila 1041). La [página oficial de Winda](https://www.getwinda.com/product-page/party-sparklers) distingue ambas presentaciones. La fotografía real conservada incluye una caja de cuatro piezas completa y separada del display: se extrajo ese objeto sin reconstruir píxeles del envase. El recorte, referencia original, hash y fuentes están en la aprobación del producto. Sin video verificado; campo vacío. La fuente mide sólo 130 px de ancho: no se inventó nitidez ni se amplió el archivo.
- **Cinco marcas corregidas por confirmación del usuario:** Big City Display, Junior Pyro y Pyro City Safe and Sane → Black Cat; War Hero → Brothers; Super Magnum → World-Class. Persisten en `../manual-corrections.json`, que aplica `catalog:sync`. Las siete correcciones anteriores siguen vigentes. Junior Pyro y Jr. Pyro Backpack son registros distintos; no se fusionaron.
- **270 productos con revisión editorial persistente** en [commercial-copy-review.json](commercial-copy-review.json). Se eliminaron descripciones automáticas, códigos usados como texto comercial y características redundantes. Se conservaron datos verificables de presentación y códigos de identificación fuera del texto comercial. Diez descripciones breves aprovechan efectos verificados; sus fuentes están registradas por ID. Un campo vacío es deliberado, no información pendiente prometida al cliente.
- **292 recursos reencuadrados**, incluido el producto nuevo; las diez fotografías originales destacadas permanecen intactas. [Auditoría de encuadre](image-framing-audit.json), [recursos finales](resource-audit.json) y [11 hojas de contacto](contact-sheets/) cubren los 302 productos, con revisión visual de todas las hojas y casos extremos.
- **Seis logos suministrados:** Bright Star, Fox, Pyro Shine, TNT, Sky Bacon y Red Rhino. Originales y hashes en [logos.json](logos.json). PNG transparentes conservados en `logo-derivatives/`; WebP optimizados publicados. Sólo Fox necesitó retirar el fondo negro conectado al borde; se preservaron sus letras blancas y detalles negros internos. Los otros cinco conservan su transparencia original y se recortaron únicamente márgenes vacíos. No se generaron logos.

## Marcas pendientes y Boomer

[brand-audit.csv](brand-audit.csv) y [brand-audit.json](brand-audit.json) registran evidencia y fuentes por producto. Los doce productos que quedan en Other brands fueron revisados. Hay candidatos para algunos, pero no suficiente evidencia de fabricante/presentación para aplicarlos silenciosamente:

- Above the Law y Pyro City: referencias a Black Cat; contenido mixto y diferencias ATPC/ATPC-2 no confirman la marca del paquete completo.
- Camo Smoke: candidato Shiu Sing sin corroboración independiente legible.
- Doggie Doo Doo: candidato Bright Star, pendiente distinguir la presentación individual de la referencia de dos unidades.
- Princess Power Sword y Victory Sword: atribuciones contradictorias entre distribuidores.
- Absolute Pyro, 120 Shot Camo Pack, Confetti Blaster, Jumbo Assorted Candles, Whistling Chaser y Silent Treatment: fabricante no confirmado por las referencias disponibles. No se infirió por prefijo de código o nombre.

**Boomer queda con un producto válido: Poopy Puppy.** La fotografía real muestra BOOMER y BM2227; UPC `805253022271` y distribuidores coinciden. Super Magnum salió de Boomer. Boom Wow es otra marca y no se mezcló con ella. No se eliminaron productos por falta de marca.

## Publicados, listos y pendientes

El inventario de Square contiene 1060 filas originales (980 con variante Regular y 80 con variante nombrada); los 963 nombres distintos no equivalen a 963 productos únicos. No se sumaron Excel y CSV. Los informes históricos de conciliación se conservan.

| Grupo actual | Cantidad y unidad | Resultado |
| --- | ---: | --- |
| Publicados | 302 IDs de catálogo | 299 identidades vinculadas a Square y 3 IDs históricos sin correspondencia exacta demostrada |
| Identificados y listos sin publicar | 0 aprobaciones completas | La única presentación adicional lista se incorporó |
| Identificados, imagen exacta pendiente | 16 filas/variantes Square | 3 rollos Black Cat; 2 Neon Sparklers; Smoke Balls; 3 Electric Sparklers; Festival Balls Boomer; 4 Handheld Snow Cones; Jumbo Morning Glory; Snappers |
| Conflictos de datos/variante | 31 filas | Incluye 2 Snow Cone Jr anteriormente agrupados como falta de imagen; primero debe aclararse la unidad de venta |
| Identidad sin confirmar | 278 filas | Sin identidad verificada |
| Identidad candidata sin confirmar | 307 filas | Requiere corroboración |
| Candidatos con revisión de envase pendiente | 103 filas | No son aprobaciones de publicación |
| Otras presentaciones por revisar | 21 filas | Identidad o paquete pendiente |
| Duplicados / excluidos | 4 / 1 filas | Decisiones previas conservadas; no se añadieron exclusiones arbitrarias |

**Quedan 756 filas/variantes pendientes**, no 756 productos nuevos. La clasificación distingue evidencia incompleta de una publicación lista. Esta iteración retomó los 19 registros anteriormente identificados sin imagen: incorporó 1, dejó 16 por recurso insuficiente y reclasificó 2 por conflicto de presentación. No presenta los 740 restantes como investigados nuevamente ni como identidades resueltas.

[identified-review.csv](identified-review.csv) detalla los 19 casos, fuentes y recurso concreto requerido. [Pendientes completos actualizados](../enrichment-2026-09/pending-products.csv) y [registro completo](../enrichment-2026-09/research-ledger.csv) se regeneran con `python3 scripts/catalog/research_ledger.py`. Las decisiones están persistidas en `../continuation-2026-09-24/row-decisions.json`; las aprobaciones comerciales en `../enrichment-2026-09/reviewed-products.json`. El informe anterior conserva sus cifras históricas.

Las limitaciones reales de recursos incluyen imágenes de paquetes incompletos, bases tapadas por displays, presentaciones distintas y baja resolución. No se publicaron recortes incompletos ni imágenes plausibles de otra variante. La revisión automática rechazó la descarga de imágenes desde nhpyro.com por una denegación de permiso. El sitio usa-fireworks.com devolvió un bloqueo de acceso durante esta revisión; no se eludió. Las alternativas locales y oficiales disponibles se evaluaron por separado.

## Encuadre reproducible y mantenimiento

`framing-policy.json` centraliza objetivos de ocupación por categoría (normal 72%; assortments 80%; formatos altos/paquetes entre 66–76%). Se mide el objeto visible con alfa > 16, se centra y se calcula un lienzo cuadrado; todos los píxeles con alfa > 0, incluidas sombras útiles, quedan dentro con un margen mínimo de 3%. Se recortan/padéan espacios transparentes y se reduce con Lanczos hasta 640 px, sin ampliar, estirar o cortar el producto. No representa una escala física común entre productos.

Los originales de cada derivado se conservan en `framing-originals/`, con hash comprobado por sync/check. Las imágenes web responsivas y la app se generan desde ese mismo original. Para un ajuste excepcional, usar `overrides` en la política, nunca reglas CSS por producto. Los diez recursos aprobados Featured quedan exentos y se verifican por hash.

```sh
# Después de aprobar/importar un lote; requiere Python + Pillow e ImageMagick
npm run catalog:frame -- --ids id-del-producto
npm run catalog:sync
npm run catalog:check
python3 scripts/catalog/audit_images.py
```

La fuente comercial sigue siendo `src/data/products.json`. Las correcciones de marca y `commercial-copy-review.json` se aplican antes de generar la app. No editar únicamente archivos generados. Si se vuelve a importar una aprobación, ejecutar sync para reaplicar la revisión editorial. `null` elimina un campo deliberadamente. La comprobación compara por ID nombres, marcas, categorías, presentación, descripción, características, modelo, video e identidad/hashes de cada recurso; no sólo cantidades.

## Interfaz y rutas

Cards sin subtítulo ni “Explore the product”: un enlace semántico abarca imagen/nombre/marca; favoritos es un botón hermano, nunca anidado. Se mantienen tamaños reservados, hover tonal, movimiento breve, foco y apertura en otra pestaña. La imagen del detalle se limita a 430 px/52svh en escritorio y 280 px/36svh en móvil sobre una superficie azul tonal; no hay fondos blancos incrustados en los recursos nuevos.

El selector permite desplazamiento táctil nativo, arrastre con mouse y controles de avance/retroceso con estado de límite. El gesto no selecciona al soltar; teclado y nombres accesibles permanecen. Other brands/MORE se ordena después de todas las marcas reales.

`public/.htaccess` conserva archivos/directorios reales, devuelve 404 para recursos inexistentes y reescribe las rutas restantes internamente a `index.html`, manteniendo la URL. El proyecto usa base raíz `/`; no se supuso una subcarpeta de hosting. El build conserva `dist/.htaccess`. Los HTML de metadatos por producto siguen generándose en `catalog-pages/`, pero estas reglas SPA no los sirven como rutas de producto; React actualiza títulos/canonical en el navegador. Los previews sociales que no ejecutan JavaScript requieren otra estrategia de metadatos en servidor y no se presentan como comprobados.

Ver [VALIDATION.md](VALIDATION.md) para comandos, entorno, capturas y comprobaciones pendientes de servidor/dispositivo.
