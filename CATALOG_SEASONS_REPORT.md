# Featured Products, botones y temporadas

Cambios locales sobre la versión existente. Sin commit, push ni despliegue.
Vista previa: http://127.0.0.1:4173/#featured-products

## Cambios

- Featured Products usa azul noche y un campo azul profundo detrás de la composición aprobada. El catálogo combina una selección destacada horizontal con productos sobre superficies claras y textos sobre azul. En móvil la selección se apila y deja visible parte del siguiente producto para indicar desplazamiento.
- Se conservan los diez productos, categorías, orden, enlaces de vídeo y variantes de imagen. Filtros y carrusel mantienen controles de 44 px como mínimo, teclado, anuncios accesibles y scroll nativo. Se corrigió el reinicio del carrusel después de filtrar, incluidos el ajuste de scroll-snap y el estado del control anterior.
- Se conservan las entradas por líneas, la entrada de la composición completa y la estela entre bloques. La interacción del producto es breve y sólo se activa con hover y sin movimiento reducido; no agrega partículas ni bucles.
- Se eliminaron las flechas decorativas de hero, historia, promoción, popup, contacto, footer y `/mobile-app`. Los botones principales usan texto y un subrayado breve; las acciones de teléfono y ubicación usan iconos funcionales. Se mantienen los controles anterior/siguiente y las indicaciones reales de volver/subir. Los badges oficiales de las tiendas no cambiaron.
- El countdown selecciona la temporada activa o la próxima por fecha entre las seis configuradas. `status` (`active`, `upcoming`, `unavailable`) es independiente de `serviceType`. `seasonPresentation.js` centraliza estado visible/accesible, explicación y único CTA. El calendario inferior sólo contiene nombres, fechas e indicador de temporada seleccionada.
- Julio y Año Nuevo conservan apertura pública regular; las otras cuatro temporadas, visitas por teléfono. No se deriva un estado “Open now” de las fechas. Se conservaron todos los horarios, fechas y America/Chicago.

## Validación

- `npm run lint`: aprobado, cero advertencias.
- `npm run test`: 32/32 aprobadas. Incluye las seis temporadas, modalidad de atención, selección cronológica con entradas desordenadas, límites inclusivos, cambio diciembre/enero, transición DST durante Diwali y presentación de ambos tipos de atención. Siguen pasando las pruebas de pausa, destrucción y ausencia de motor en modos estáticos.
- `npm run build`: aprobado. JS principal 222.33 kB / 71.14 kB gzip; sin dependencias nuevas.
- `git diff --check`: aprobado.
- Chrome local: 1440×1000, 834×1112, 390×844 y 320×740; adicionalmente 844×390 para cambio de orientación. Sin overflow horizontal de la página. El desbordamiento interior del carrusel es intencional.
- Comprobados filtros, retorno a todos los productos, controles de carrusel, navegación del carrusel con flechas del teclado, filtro con Espacio y foco visible de 3 px, menú móvil con Enter y cierre automático. Anclas medidas a menos de 1 px del borde inferior del encabezado, incluida navegación desde `/mobile-app`.
- Promociones: apertura con Enter, cierre con Escape y restauración del foco. Los enlaces de PDF, teléfono, ubicación, legales y app siguen presentes. iOS mantiene `id6793552663`; Android sigue “Coming soon”. No se inició una llamada real.
- Reloj simulado en fixture local: Diwali activa, Independence Day futura y activa, Año Nuevo activo y Texas Independence Day futura en 320 px. En todos los casos, un CTA en el bloque principal y cero enlaces/botones en la lista. El fixture fue eliminado por el build final y no forma parte de la aplicación.
- Hero móvil a 390 px: cero canvas y sin botón de pausa. En escritorio se comprobó pausa/reanudación. La simulación de preferencia reducida destruyó el canvas y retiró el control; al restaurarla reapareció el motor. Esta simulación verifica la política JavaScript, no emula la preferencia CSS del sistema operativo.
- Contraste calculado de pares principales: texto introductorio 7.53:1, texto secundario sobre el azul más claro 6.36:1, categoría 8.02:1, mensaje de atención 10.99:1, CTA naranja 6.22:1 y filtro seleccionado 7.50:1. No equivale a una auditoría completa de accesibilidad.
- Consola de la aplicación sin errores ni advertencias en las rutas revisadas.

## Preservación y límites

Se compararon hashes contra el estado inicial: ningún archivo de `public/`, los datos del catálogo ni los motores/CSS del hero cambiaron. La imagen aprobada de la plataforma, Dallas y los cielos estáticos permanecen intactos. En `Hero.jsx` sólo se retiraron flechas de enlaces. El estado Git de `rockwall-fireworks-mobile` sigue igual (`?? app-store-assets/` preexistente); no se editó ese proyecto.

Las pruebas responsive se hicieron con viewports de Chrome de escritorio, no con dispositivos físicos. Quedan pendientes una prueba táctil física y una revisión con movimiento reducido activado en el sistema operativo. No se afirma una medición de rendimiento en teléfonos reales. La discrepancia preexistente entre el horario comercial publicado (8am–12am) y el inicio configurado a las 9am de las temporadas públicas se mantiene sin inventar un reemplazo.

## Capturas

Capturas completas de sección en `artifacts/catalog-season-redesign/`:

- `products-desktop.png` y `products-mobile.png`.
- `countdown-desktop.png` y `countdown-mobile.png`: reloj real, próxima temporada Diwali.
- `products-tablet.png`.
- `countdown-public-active-desktop.png`: reloj simulado al 25 de junio de 2026, explícitamente evidencia de prueba.
- `browser-season-checks.json`: resultados de las cuatro fechas simuladas de escritorio.

El backup y los hashes iniciales están en la misma carpeta ignorada para respetar los cambios locales anteriores.
