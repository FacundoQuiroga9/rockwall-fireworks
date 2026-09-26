# Rockwall Fireworks — refinamientos locales, 25 de septiembre de 2026

> Estado vigente: [iteración de BOGO, flyer 2026, videos y PDF compacto](../iteration-2026-09-25/README.md). BOGO only ahora devuelve los ocho marcados; este informe anterior conserva su contexto histórico.

Esta revisión continúa `my-list-2026-09/README.md`. No se hizo push, despliegue ni publicación. Se respetó el trabajo previo de ambas ramas `main`, que ya tenían cambios y archivos sin seguimiento. No se encontraron instrucciones `AGENTS.md` en los proyectos ni en los ancestros revisados.

## Interfaz

- Hero: eliminado únicamente el enlace al flyer 2025; texto de antigüedad y control del cielo equilibran la franja. Cielo, ciudad, sello y controles conservados. El CTA de productos lleva a `/products`.
- Home: nueva composición `DiscoverProducts` con título, plataforma aprobada protagonista, acento orbital estático, 17 logos y CTA principal. Sin instancia del carrusel, filtros ni flechas de Featured Products. Los componentes del catálogo se conservan. Logos enlazan a su marca real; Boom Wow lleva al catálogo general porque no hay productos publicados bajo ese nombre. `#featured-products` sigue apuntando a la nueva sección, `#brands` a los logos y `#catalog` conserva la redirección al catálogo.
- BOGO: etiqueta gráfica 1+1, tipografía Anton/Jura, borde naranja, corte asimétrico y texto visible “Check in store”. Ubicada junto a la marca o debajo en móvil, sin cubrir fotografía ni controles. El nombre accesible explica Buy One, Get One. Mismo componente en cards/fichas de cada plataforma.
- Filtro BOGO only: botón reversible con `aria-pressed` en web, checkbox accesible en app; se combina con búsqueda, marca, categoría y favoritos existentes. Web conserva estado en `?bogo=1`; limpiar filtros lo elimina. El estado vacío permite desactivar sólo BOGO o limpiar todo.
- My List: guía HTML de tres pasos con dibujos SVG propios junto al título, usando el espacio libre de la derecha. En móvil se pliega en una fila opcional; en app se adapta con iconos Ionicons ya instalados. Selecciones, resumen y exportación permanecen disponibles. Teléfono o papel son alternativas.
- No se modificaron fotografías de productos, plataforma, favoritos ni enlaces externos de video. No hay dependencias nuevas.

## Cakes: investigación y decisiones

31 cakes individuales pendientes investigadas; **28 resueltas: 20 de 500g y 8 de 200g**. Tres conservan `Cakes - Size Unconfirmed`. Se revisaron además los cinco paquetes fijos, que siguen en `Cake Packs` y no se convierten en una cake por la suma del embalaje.

Clasificación vigente: **72 de 500g, 37 de 200g, 5 Cake Packs y 3 sin confirmar**. No se confirmó una presentación de 250g entre estos casos. Hay indicios reales de 350g, registrados como conflictos; no se forzaron a 200g/500g.

Método: identidad aprobada y código/UPC del maestro + fabricante/catálogo oficial; distribuidor cuando el fabricante sólo publica “Cake” o “Heavy Weights”. La clase comercial no es una medición del contenido neto ni el peso de transporte. Alien Attack y Night Rider también tienen el gramaje impreso en el recurso aprobado, inspeccionado visualmente. No se regeneró ninguna imagen.

Registro ejecutable: [cake-research.json](cake-research.json). Evidencia de componentes: [pack-research.json](pack-research.json). Cada registro conserva nombre, ID, imagen, marca, código, presentación, fuentes y decisión. Los códigos de coincidencias investigadas no se inventan como SKU de tienda.

| Producto | Marca / modelo | Decisión | Evidencia principal |
|---|---|---|---|
| Atom Bomb | Brothers / BP-A013-1 | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Cobalt Bomb | Brothers / BP-A013-4 | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Hydrogen Bomb | Brothers / BP-A013-2 | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Neutron Bomb | Brothers / BP-A013-3 | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Blood Money | Brothers / BP-A090-3 | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Crime Scene | Brothers / BP-A090-1 | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Inside Job | Brothers / BP-A090-2 | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Turf War | Brothers / BP-A090-4 | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Whacky Tobacky | Brothers / Ver identidad en registro | 500g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Magical Barrage | Black Cat / Ver identidad en registro | 200g Cakes | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) |
| Canopus | Brothers / BP-A084-1 | 500g Cakes | [Fuente 1](https://www.brotherspyrotechnics.com/fCategory/Heavy%20Weights?pageindex=18) · [Fuente 2](https://springfieldfireworks.com/product/brothers-stars-case-1-4/) |
| Centauri | Brothers / BP-A084-2 | 500g Cakes | [Fuente 1](https://www.brotherspyrotechnics.com/fCategory/Heavy%20Weights?pageindex=18) · [Fuente 2](https://springfieldfireworks.com/product/brothers-stars-case-1-4/) |
| Vega | Brothers / BP-A084-3 | 500g Cakes | [Fuente 1](https://www.brotherspyrotechnics.com/fCategory/Heavy%20Weights?pageindex=18) · [Fuente 2](https://springfieldfireworks.com/product/brothers-stars-case-1-4/) |
| Capella | Brothers / BP-A084-4 | 500g Cakes | [Fuente 1](https://www.brotherspyrotechnics.com/fCategory/Heavy%20Weights?pageindex=18) · [Fuente 2](https://springfieldfireworks.com/product/brothers-stars-case-1-4/) |
| Good Thinkin’ Lincoln | Winda / Ver identidad en registro | 500g Cakes | [Fuente 1](https://www.getwinda.com/_files/ugd/ecdf0c_061e189188b74685bd3c26fae70b964e.pdf) |
| Lucky Streak | Bright Star / BS6020 | 200g Cakes | [Fuente 1](https://www.getwinda.com/_files/ugd/ecdf0c_061e189188b74685bd3c26fae70b964e.pdf) |
| Whisky Business | Bright Star / BS8039 | 500g Cakes | [Fuente 1](https://www.getwinda.com/_files/ugd/ecdf0c_061e189188b74685bd3c26fae70b964e.pdf) |
| Alien Attack | Happy Family / Ver identidad en registro | 500g Cakes | [Fuente 1](https://americanwholesalefireworks.com/alien-attack/) |
| Night Rider | Monkey Mania / Ver identidad en registro | 200g Cakes | [Fuente 1](https://www.hotrocketfireworks.com/night-rider-by-monkey-mania-fireworks/) |
| Neon Jellyfish | Raccoon / RA57212 | 500g Cakes | [Fuente 1](https://americanwholesalefireworks.com/neon-jellyfish/) |
| Hot as Hell | Raccoon / RA57216 | 500g Cakes | [Fuente 1](https://americanwholesalefireworks.com/hot-as-hell/) |
| Big Top | Brothers / BP2035 | 500g Cakes | [Fuente 1](https://www.pyromart.com/ground-spinners-and-winged-items/big-top/) |
| Jaws | Brothers / BP2377 | 200g Cakes | [Fuente 1](https://elevatedfireworks.com/products/jaws-16-shot-standard-aerial-cake) |
| Mechanical Bug | Brothers / BP2838 | 200g Cakes | [Fuente 1](https://pahrump.area51fireworks.com/product/mechanical-bug-100-shots-each/) |
| MegaWatt | Brothers / BP2608 | 500g Cakes | [Fuente 1](https://www.fireworkscity.com/product/megawatt/) |
| The Red, White and Blue Salute | Brothers / BP2905 | 200g Cakes | [Fuente 1](https://americanwholesalefireworks.com/arrival-notices-and-important-information/arrival-notice-from-brothers-pyrotechnics/) |
| Wild West | Brothers / BP2924 | 200g Cakes | [Fuente 1](https://americanwholesalefireworks.com/wild-west/) |
| Flying Colors | Brothers / BP2856 | 200g Cakes | [Fuente 1](https://www.youtube.com/watch?v=wzrbWj7K7SI) |
| Old Ironsides | Brothers / BP2452 | Cakes - Size Unconfirmed | [Fuente 1](https://www.brotherspyrotechnics.com/CoverDetail/41?page=20) · [Fuente 2](https://americanwholesalefireworks.com/old-ironsides/) · [Fuente 3](https://www.superiorfireworks.com/blog/2020/05/all-about-350-gram-repeaters/) · [Fuente 4](https://elitefireworks.us/Old-Ironsides-p548891776) |
| Light Brigade | Brothers / Ver identidad en registro | Cakes - Size Unconfirmed | [Fuente 1](https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf) · [Fuente 2](https://www.brotherspyrotechnics.com/detail/5244) · [Fuente 3](https://elevatedfireworks.com/collections/brothers-350-gram-cakes) |
| 2 Minutes Extravaganza | TNT / Ver identidad en registro | Cakes - Size Unconfirmed | [Fuente 1](https://www.tntfireworks.com/fireworks/cat/multi-aerials/4100-2-minutes-extravaganza) · [Fuente 2](https://www.tntfireworks.com/fireworks/cat/big-thunder) |

### Pendientes individuales

- **Old Ironsides, BP2452, UPC 687985245215:** American Wholesale clasifica 200g; Superior, que documenta una colaboración con Brothers para su paquete, y otros distribuidores lo presentan como 350g. Brothers y el envase aprobado sólo indican Heavy Weights. Hace falta confirmar la clasificación de la variante del local.
- **Light Brigade, BP2453 / UPC 687985245314:** tabla oficial de Winco lo ubica en 500g; Elevated lo incluye en su colección Brothers 350g. El fabricante dice Heavy Weights. No se eligió una categoría ignorando la discrepancia.
- **2 Minutes Extravaganza, TNT / Big Thunder, UPC 887946004213:** el fabricante confirma identidad pero sólo publica Multi Aerials. El envase aprobado muestra 63 shots y código BT…863. No se adoptó el gramaje de Top Gun TGA863 por compartir nombre. Falta gramaje comercial específico de la variante TNT.

Winda 2026 se consultó mediante el contenido indexado del PDF oficial; su descarga directa por la herramienta devolvió error. Winco se consultó como PDF de 49 páginas y las identidades de Brothers/Raccoon se contrastaron con sus páginas oficiales y la revisión aprobada anterior. La fecha del registro es la fecha de consulta, no una afirmación de vigencia comercial de un proveedor.

## Estado real de BOGO

Se conservan **8 productos con marcador de origen**, procedentes de 68 filas reconciliadas. No se activó ninguna promoción ni cupón.

- `evidenceStatus: source-marked`: evidencia histórica del producto exacto, con tokens Square.
- `eligibilityStatus: pending`: la elegibilidad comercial actual sigue sin confirmación independiente.
- Campaña `status: pending`: faltan vigencia, criterio de unidad bonificada cuando difieren precios, límites y compatibilidad con cupones. La campaña mantiene su revisión; no se inventó una nueva campaña vigente.

`getBogoState` centraliza estos estados. BOGO only requiere elegibilidad verificada, campaña vigente y reglas completas (incluidos precios si la regla los necesita). **Actualmente devuelve cero productos**, con una explicación visible. Las cards marcadas muestran “Check in store”, no una oferta activa.

My List permite preparar candidatos explícitos, incluso incompletos, sin asignación paid/free confirmada. Ambos deben tener marcador exacto y la misma categoría; las marcas pueden diferir. La evaluación ahora exige además elegibilidad verificada para aplicar un beneficio. Los pares pendientes siguen sin bonificación en pantalla y PDF. Los cupones 2025 continúan archivados e inactivos. Ninguna cake investigada tiene marcador BOGO actual; no se creó elegibilidad por reclasificarla.

## Fuente maestra, sincronización y listas guardadas

`src/data/products.json` sigue siendo el maestro. `catalog:sync` aplica primero correcciones manuales/editoriales y la conciliación anterior, luego el registro de investigación por ID/nombre/imagen. La capa posterior evita que reconstruir `commercial-review.json` revierta las nuevas categorías. Se ejecutó de nuevo `review_commerce.py` y luego sync/check para comprobarlo.

BOGO pendiente queda en el registro comercial y en su generador. Sync copia y compara los datos, tipos, reglas y renderer PDF de ambas plataformas. Conserva los 302 IDs, recursos aprobados y Silent Treatment → Fox.

Las listas antiguas retienen su snapshot y cantidad. Un cambio de categoría se marca para revisión; no se reemplaza una variante ni se reasigna el grupo BOGO silenciosamente. Al aceptar la revisión explícita se actualiza el snapshot; una pareja que ahora mezcle categorías sigue bloqueada. Los grupos conservan unidades propias, sin reutilizarlas en beneficios incompatibles.

## Validación

- Web: `catalog:sync`, `catalog:check`, `lint`, `test` (**81/81**) y `build`: PASS. La reconstrucción de la conciliación previa también pasó antes del último sync/check.
- App: `typecheck`, `lint`, `test` (**33/33**): PASS. `CI=1 npx expo export --platform all --output-dir dist-refinement`: PASS para iOS, Android y web. Esto valida compilación/exportación, no una ejecución nativa.
- Pruebas nuevas: cobertura de las 31 decisiones y 28 migraciones de snapshots, preservación de correcciones, separación 200/250/500g, combinación de filtros BOGO, marcado vs elegibilidad vs actividad, vigencia y reglas pendientes, precios ausentes, revisión de grupos modificados y navegación/imagen de home. Se conservaron pruebas de cantidades pares/impares, promociones incompletas, beneficios incompatibles, persistencia, edición, PDF y paridad.
- Navegador Chrome: escritorio 1440, tablet 768, móviles 390 y 320. Hero sin enlace 2025, nueva home, filtros, cards y ficha, guía vacía/con productos, favoritos independientes, cantidades tras recarga, elección BOGO de otra marca, disolver pares sin duplicar, quitar productos, modo mostrador y descarga PDF con/sin fotos. Sin overflow horizontal en los estados medidos ni controles interactivos anidados. Teclado Space activa/desactiva BOGO y foco visible conservado. Consola de las tres pestañas finales sin errores ni warnings.
- PDFs regenerados y abiertos mediante Poppler, 4/4/5 páginas. Todas las páginas renderizadas se inspeccionaron: nombres largos, cantidades paid/free/total, encabezados repetidos, condiciones, miniaturas y cortes entre grupos. El ejemplo con beneficios completos está rotulado **TEST ONLY** y usa fixtures aislados; no es una oferta Rockwall.

### Limitaciones verificadas

- `xcrun simctl list devices booted` falló por conexión inválida/denegada a CoreSimulatorService. No se comprobó pantalla ni share sheet en simulador o dispositivo real.
- La revisión de movimiento reducido cubre CSS y el hook existente (`matchMedia`, cancelación de animaciones y ausencia de animaciones continuas nuevas). La emulación visual mediante DevTools no se pudo completar: el acceso nativo a Google Chrome fue rechazado por el control de permisos. No se presenta como prueba visual realizada.
- Vite conserva el aviso del chunk lazy de miniaturas PDF (~1,49 MB; ~742 kB gzip). Sólo se carga al exportar con fotos; no se añadió una dependencia.
- Las condiciones BOGO y las tres cakes ambiguas requieren las confirmaciones concretas descritas arriba.

## Revisión local

Vista previa web: http://127.0.0.1:5175/ . Catálogo: `/products`. Lista: `/my-list`. Para una lista de prueba independiente se usó `http://localhost:5175`; no se borró la lista anterior de `127.0.0.1`.

Capturas en [screenshots/](screenshots/): home escritorio/tablet/móvil, cards y filtro, ficha, My List con guía y estados vacíos.

PDFs: [con miniaturas](../../../output/pdf/refinement-2026-09-25/my-list-with-photos.pdf), [sin fotos](../../../output/pdf/refinement-2026-09-25/my-list-no-photos.pdf), [fixture de promociones TEST ONLY](../../../output/pdf/refinement-2026-09-25/promotion-layout-test.pdf). Las páginas PNG se conservan junto a los PDF para revisar impresión.
