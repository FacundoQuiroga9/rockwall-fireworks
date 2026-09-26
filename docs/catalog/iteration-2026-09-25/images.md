# Imágenes: auditoría y cambios

Se inspeccionaron dimensiones, alfa y fuentes de los 302 recursos; se compararon visualmente los 11 originales seleccionados y sus derivados. Una resolución baja no implica automáticamente una imagen incorrecta en una card pequeña. Se preservaron las demás fotos aprobadas.

## Once mejoras aprobadas

Se reemplazó el derivado comprimido por uno creado desde el mismo PNG original aprobado (1668 px). Web hasta 960 px, app hasta 640 px, versiones web 320/480 y miniaturas PDF regeneradas. Sin ampliar píxeles, sin dibujar envases nuevos; se mantuvieron alfa, sombras, ocupación y márgenes de la política existente.

| Producto | ID | Fuente local preservada |
|---|---|---|
| Diwali Dazzler | diwali-dazzler | [diwali-dazzler-original.png](../enrichment-2026-09/references/diwali-dazzler-original.png) |
| Snow Cone | snow-cone | [snow-cone-original.png](../enrichment-2026-09/references/snow-cone-original.png) |
| Eagle Pride | eagle-pride | [eagle-pride-original.png](../enrichment-2026-09/references/eagle-pride-original.png) |
| America First | america-first | [america-first-original.png](../enrichment-2026-09/references/america-first-original.png) |
| U.S. Power | us-power | [us-power-original.png](../enrichment-2026-09/references/us-power-original.png) |
| 3 Min | 3-min | [3-min-original.png](../enrichment-2026-09/references/3-min-original.png) |
| Ladybugs | ladybugs-3-pack | [ladybugs-3-pack-original.png](../enrichment-2026-09/references/ladybugs-3-pack-original.png) |
| Blond Joke | blond-joke | [blond-joke-original.png](../enrichment-2026-09/references/blond-joke-original.png) |
| Land of the Free | land-of-the-free | [land-of-the-free-original.png](../enrichment-2026-09/references/land-of-the-free-original.png) |
| USA Saturn Missile Battery | usa-saturn-missile-battery | [usa-saturn-missile-battery-original.png](../enrichment-2026-09/references/usa-saturn-missile-battery-original.png) |
| No. 3 Cone Fountain | no-3-cone-fountain-2-pack | [no-3-cone-fountain-2-pack-original.png](../enrichment-2026-09/references/no-3-cone-fountain-2-pack-original.png) |

Los SHA-256 y originales anteriores están en [image-upgrades.json](image-upgrades.json) e `image-originals/`. Las URLs de fabricante y la aprobación histórica están en `../enrichment-2026-09/reviewed-products.json`; el cambio utiliza esas mismas fotografías. `frame_products.py` conserva el origen de alta resolución mediante `framingSource`; volver a encuadrar no recupera el derivado pequeño.

## Referencias todavía limitadas

Estos 25 archivos tienen menos de 350 px de lado. La hoja de contacto a escala de card conserva legibilidad general, pero el detalle ampliado puede revelar suavidad o microtexto insuficiente. Se necesitan originales mayores de la misma variante para mejorarlos; no se autoriza reemplazarlos por un envase reconstruido. Los casos con halos (Little Dynamite, Joker, Gatlin Pack) conservan también la limitación de la fuente.

| Producto | ID | Lado actual |
|---|---|---|
| Avalanche | avalanche | 345 px |
| Good Thinkin’ Lincoln | good-thinkin-lincoln | 345 px |
| Nation Ovation | nation-ovation | 334 px |
| Pyro Pilot | pyro-pilot | 344 px |
| Bump Bear | bump-bear | 338 px |
| Four Assorted 9-inch Fountains | black-cat-four-assorted-9-inch | 345 px |
| Four Assorted 6-inch Fountains | black-cat-four-assorted-6-inch | 348 px |
| Fountastic | fountastic | 298 px |
| Little Dynamite | little-dynamite-100 | 346 px |
| 3 For 1! | 3-for-1-fountains | 275 px |
| Cracker Balls | cracker-balls-6-pack | 279 px |
| Joker | joker-black-cat-fountain | 341 px |
| Jr. Pyro Backpack | jr-pyro-backpack-black-cat | 293 px |
| Texas Bandit Rocket | texas-bandit-rockets | 258 px |
| Kids Pack | kids-pack-black-cat | 335 px |
| M-150 Red Salute | m150-red-12-pack | 246 px |
| Neon Camo Smoke | neon-camo-smoke-4-pack | 300 px |
| Packin' Purple | packin-purple | 269 px |
| Party Animal | party-animal-assortment | 290 px |
| Excellent Bag | excellent-bag | 299 px |
| Gatlin Pack | gatlin-pack | 322 px |
| 100 Shot Missile Base | black-cat-missile-base-100 | 291 px |
| Party Pack 4 | black-cat-party-pack-4 | 305 px |
| Hot Sauce | hot-sauce | 335 px |
| Assorted Snakes | black-cat-assorted-snakes | 335 px |

**Fountastic:** la referencia real disponible es pequeña. Se localizó una imagen oficial mejor, pero el control de permisos del navegador rechazó su descarga; no se intentó eludir ese rechazo. Una edición generada desde la referencia local alteró letras/microtexto y fue descartada. Se conserva sólo como evidencia en `rejected/`, fuera de los recursos públicos. No se afirma haber solucionado este producto.

La plataforma circular y el hero no se modificaron. No se agregó ninguna imagen sintética al catálogo.
