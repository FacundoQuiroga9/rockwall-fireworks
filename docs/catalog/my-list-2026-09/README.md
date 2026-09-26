# Iteración My List y catálogo — revisión local

> Estado vigente: [iteración de BOGO, flyer 2026, videos y PDF compacto](../iteration-2026-09-25/README.md). BOGO only ahora devuelve los ocho marcados; este informe anterior conserva su contexto histórico.

> Actualización 2026-09-25: la [revisión de categorías e interfaz](../refinement-2026-09-25/README.md) resuelve 28 de las 31 cakes pendientes e incorpora home, filtro BOGO y guía My List. Este informe anterior conserva la evidencia histórica; consultar la revisión nueva para los totales vigentes.


Fecha de trabajo: 24 de septiembre de 2026, America/Chicago. Los PDF incluyen su instante real de generación en UTC.

Implementación local en web y app; sin push, despliegue ni publicación. Se preservaron los cambios que ya existían en ambos repositorios. La implementación de listas funciona; **la aplicación comercial de BOGO continúa pendiente de confirmaciones**.

## Presentación e identidad

- Cards, fotos y ficha con fondos transparentes, marco de esquinas asimétricas y acento naranja. Nombre, categoría, logo o marca textual, BOGO y controles independientes. El distintivo se ubica junto a la marca para no tapar envases en pantallas pequeñas.
- Enlace accesible de producto separado de favoritos y My List; foco visible. No se recuperaron las descripciones redundantes ni “Explore the product”. Videos externos y favoritos conservados.
- Las 302 fotografías aprobadas mantienen sus SHA-256; las 302 contienen transparencia real. No se regeneraron productos, ni se alteraron márgenes, proporciones o identidad del envase. Las miniaturas blancas del PDF son derivados exclusivos de impresión.
- TNT: extracción de fondo con ImageGen, recurso con alfa, derivados WebP de 320/160 px y original preservado. Fox y Pyro Shine ya tenían alfa: se retiró el bloque CSS y se añadió contorno/sombra ajustado a sus letras para la sección clara. Recursos compartidos con la app. Ver `logo-review.json`.
- Silent Treatment → Fox en `manual-corrections.json`, con guardas de ID/nombre/imagen. Sync y pruebas comprueban su persistencia.

## Evidencia BOGO

El volumen `/Volumes/FACUNDO` no está montado. No se pudieron reabrir los CSV/XLSX originales indicados. Se utilizó `../2026-08-square/inventory-master.csv`, conciliación conservada de 1.060 variantes de ambos archivos, con token, SKU y números de fila. **No equivale a una nueva inspección de los originales.** No se escribió sobre archivos Square.

Hay 68 filas con marcador BOGO (incluidas las variantes con `_BOGO`). Ocho identidades publicadas tienen vínculo exacto aprobado con esas filas; las demás no se incorporaron por parecido de nombre. La evidencia completa está en `bogo-evidence.json`.

| Producto publicado | Categoría | Nombre / variante en evidencia | Fila CSV / Excel Items |
|---|---|---|---|
| Freedom’s Wings (`freedoms-wings`) | Fountains | Freedom Wings BOGO Fountain / Regular | 385 / 386 |
| Little Dynamite (`little-dynamite-100`) | Firecrackers | Black Cat Little Dynamite 100ct BOGO / Regular | 213 / 214 |
| M-150 Red Salute (`m150-red-12-pack`) | Firecrackers | M-150BlackCat 12 ct.   BOGO $6.00 TOTAL / Regular | 553 / 554 |
| Party Poppers (`party-poppers-6-pack`) | Novelties | Party Popper BOGO / Regular | 668 / 669 |
| Black Cat Firecrackers 50 Pack (`black-cat-50-pack`) | Firecrackers | Black Cat 50ct BOGO / Regular | 202 / 203 |
| Black Cat Firecrackers 200 Pack (`black-cat-200-pack`) | Firecrackers | Black Cat Firecracker 200ct BOGO / Regular | 207 / 208 |
| M-5000 Salute Crackers (`m-5000-world-class-12-pack`) | Firecrackers | M-5000 Salute Cracker 12 pcs BOGO / Regular | 556 / 557 |
| Unicorn Chaser (`unicorn-chaser-2-pack`) | Novelties | Unicorn Chaser_BOGO / Regular | 935 / 936 |

La marca de origen está confirmada; su vigencia actual no. Las cards dicen “BOGO / Check in store”; una combinación puede prepararse pero no aparece como beneficio aplicado.

Reglas confirmadas por el usuario: una unidad comprada más una adicional; ambas elegibles, misma categoría; pueden ser de marcas distintas. No se cruzan cakes 500g con 200g ni con paquetes o gramaje desconocido.

## Cakes y promociones

52 **500g Cakes**, 29 **200g Cakes**, 5 **Cake Packs** y 31 **Cakes - Size Unconfirmed** reemplazan 117 entradas de Cakes. Se usó gramaje explícito de presentación aprobada o nombre/categoría Square vinculados; nunca tamaño de imagen ni peso de embalaje. No hay evidencia de 250g. Todos los casos y sus fuentes están en `cake-classification.json`; Old Ironsides conserva el conflicto sin inventar gramaje.

Se abrieron/renderizaron las dos páginas del cupón original `public/rf coupons.pdf`. Los tres cupones de precio vencieron el 4/7/2025: 500g a $50, tres 200g por $75 y un paquete de 24 shells de 60g por $75, sujetos a existencias. La primera página ofrece una novedad al presentar la tarjeta de esa campaña de 2025, sin vigencia actual verificada. Se archivaron como cuatro registros estructurados, **ninguno seleccionable como campaña vigente**. Los enlaces de home/footer/modal se identifican como archivo 2025.

No se conocen precios actuales confiables, por lo que no hay total monetario ni importes parciales. Tampoco existe una composición fija verificada de una campaña actual; los paquetes comerciales siguen siendo una unidad de venta completa.

## My List y reglas compartidas

- Web `/my-list`; app pestaña My List con contador. Agregar desde cards y fichas, editar cantidades, quitar, elegir explícitamente la segunda unidad BOGO, cambiarla, completar pares o conservar los productos como individuales. Vista de mostrador y PDF con/sin miniaturas.
- Motor único en `src/shared/myList.js`; datos `products.json` + `promotions.json`. Sync genera copias propias en la app y check compara reglas, PDF, logos, imágenes y campos comerciales. No depende del repositorio hermano durante ejecución.
- Distingue individuales, paquetes fijos, ofertas de selección y pares BOGO. La configuración de ofertas verificadas tiene filtros de elegibilidad, cantidades requeridas, edición de selección y estado incompleto. Los ejemplos activos son solamente fixtures de prueba, nunca campañas publicadas.
- Cada grupo posee unidades independientes. Iniciar BOGO transfiere una unidad individual; no duplica una unidad para dos beneficios. No se elige un regalo automáticamente. Límites y compatibilidad requieren confirmación explícita.
- Persistencia separada: `rockwall:my-list:v1` (web) / `@rockwall-fireworks/my-list:v1` (app). ID más snapshot detecta cambios de variante, desaparición y revisiones de promoción; se preserva la selección anterior hasta revisión. Datos dañados no se sobrescriben silenciosamente. No hay cuenta ni sincronización entre dispositivos.
- PDF vectorial de fondo blanco, encabezados repetidos, páginas numeradas, marca escrita, categoría, presentación, códigos Square disponibles, columnas paid/free/total y condiciones. Los guiones indican asignación pendiente. Aviso de lista para tienda, sin pedido ni reserva.
- Sin dependencias npm nuevas. El renderer PDF y thumbnails se comparten. La app usa el módulo FileSystem que ya incluye Expo; ExpoSharing cuando está disponible, Share nativo en iOS, y selector de carpeta SAF en Android como alternativa. El último permite guardar y luego compartir desde Files.

## Validación

- Web: `catalog:sync`, `catalog:check`, lint, test y build: PASS. 75 pruebas.
- App: typecheck, lint, test: PASS. 31 pruebas. Bundles locales de iOS, Android y web generados sin publicar.
- Paridad: 302 productos/identidades, campos BOGO/cakes/SKU, marca Fox, reglas y renderer copiados sin divergencias. 302/302 fotografías originales sin cambios.
- Casos probados: elegibilidad exacta, marcas diferentes, rechazo entre gramajes, no elegibles, pares/impares, pares incompletos, límites, propiedad exclusiva de unidades, precios ausentes/diferentes, listas guardadas/editadas, variantes retiradas/modificadas, campañas vencidas/revisadas, ofertas configurables y paquetes fijos.
- Navegador: catálogo, detalle, home y My List. Escritorio 1440 px, tablet 768, móviles 390/320; cero overflow de página después de corregir el encabezado a 320 px. Favorito por Space y foco naranja de 3 px sin navegación, cero controles interactivos anidados. Alta, cambio de cantidades, pareja de marcas distintas, recarga persistente, vista de mostrador y descarga de ambos modos PDF. Consola de la revisión sin errores ni warnings.
- Movimiento reducido: nuevas transiciones desactivadas con media query; la app no agrega animación a selección ni fotos. La cobertura existente del cielo responsive también pasa. No se alteró la preferencia del sistema operativo.
- PDF: tres archivos reales, 4/4/5 páginas, abiertos y renderizados con Poppler; revisión de todas las páginas y ampliación de nombres largos/BOGO. Se corrigieron espacio desperdiciado y líneas demasiado próximas al siguiente nombre. No se exportó una captura oscura.

Limitaciones de verificación: no se ejecutó la pantalla ni el share sheet en un teléfono/simulador. El servidor Metro local falló al buscar puerto (65536); el entorno también rechazó abrir un listener adicional. Los bundles prueban compilación, no ejecución nativa. La exportación con miniaturas genera un chunk lazy de ~1,49 MB (~742 kB gzip): Vite avisa por tamaño; sólo se descarga al solicitar PDF con fotos.

## Archivos para revisar

- Preview: http://127.0.0.1:5175/my-list (servidor local; no desplegado).
- Capturas: `screenshots/cards-desktop.png`, `detail-desktop.png`, `my-list-desktop.png`, `cards-mobile.png`, `my-list-320.png`, `my-list-390.png`, `my-list-768.png`, `logos-home.png`, `keyboard-focus.png`, `my-list-counter.png`.
- `../../../output/pdf/my-list-with-photos.pdf`: catálogo real, individuales y par pendiente, 4 páginas.
- `../../../output/pdf/my-list-no-photos.pdf`: misma selección sin fotos, 4 páginas.
- `../../../output/pdf/promotion-layout-test.pdf`: 5 páginas, **TEST ONLY**; simula BOGO aplicado, selección de tres y paquete fijo para validar diseño. No acredita ofertas comerciales reales.
- Renders de QA: `../../../tmp/pdfs/final/`. Fixtures: `pdf-fixtures.json`.

## Pendientes comerciales concretos

1. Confirmar si las ocho marcas BOGO de agosto siguen vigentes y con qué fechas.
2. Confirmar si se admiten precios distintos y cómo se elige la unidad bonificada.
3. Confirmar límites por operación y compatibilidad con cupones/promociones.
4. Facilitar acceso al volumen original y, si existe, a una campaña vigente con productos elegibles exactos.
5. Resolver las 31 cakes sin gramaje y el contenido/clasificación de los paquetes que deban participar.
6. Probar navegación y exportación/compartir en dispositivo antes de publicar la app.

Las preguntas comerciales fueron enviadas al usuario durante la implementación y siguen sin respuesta al cerrar esta revisión. Ninguna condición pendiente se presenta como terminada.
