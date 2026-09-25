# Hero, navegación, movimiento y temporadas — 23 septiembre 2026

Preview de producción local: http://127.0.0.1:4173/ (proceso de preview existente, puerto 4173).
Cambios locales, sin commit, push ni despliegue. Se revisaron README, instrucciones disponibles y Git antes de editar. Se guardó el estado inicial en `artifacts/current-adjustments/baseline-sha256.json`.

## Implementación

- **Cielo:** el controlador decide el modo antes de crear canvas o inicializar `createNightSky`. Está estático con ancho ≤700 px, puntero principal `coarse`, o `prefers-reduced-motion: reduce`. Las tablets táctiles también son estáticas, incluso en horizontal; una tablet con puntero principal preciso y ancho >700 puede animar. Es un criterio conservador de interacción/rendimiento, sin detección por marca o user-agent. Una ventana estrecha de escritorio también usa el fallback estático y NO equivale a un teléfono físico.
- Tres composiciones SVG originales de estrellas y explosiones, para teléfono, tablet vertical y formato ancho. Pesos aproximados sin compresión: 28/35/49 KB; gzip: 4.6/5.6/7.8 KB. No tienen animaciones. El skyline aprobado se mantiene por encima y conserva sus imágenes WebP responsivas, transparencia y dimensiones reservadas.
- Al entrar en modo estático se destruyen motor, observadores, eventos y RAF, y se elimina el canvas. Al volver al animado se crea una sola instancia, respetando la pausa manual previa. El botón de pausa sólo existe en modo animado. Ritmo, posiciones, colores y renderer de escritorio sin cambios.
- **Navegación:** `ResizeObserver` mide el header completo, incluida la barra naranja, y actualiza `--header-offset`. `scroll-margin-top` es la única compensación. Las anclas nativas y los Links tienen el mismo comportamiento, admiten clic repetido y llevan el foco al encabezado destino después de cerrar el menú. Se espera el montaje de rutas diferidas. Sin scroll snapping vertical ni bloqueo del desplazamiento.
- Espaciado de secciones más compacto, ajustes específicos para laptops de menor altura, imagen About adaptada al viewport, y plataforma a 400 px máximos en escritorio. Catálogo, contacto móvil y calendario móvil crecen naturalmente. No se recorta contenido para forzar una pantalla.
- **Movimiento:** titulares con máscaras independientes por línea; entrada breve de la plataforma completa con perspectiva y asentamiento; marcas coordinadas y hover alternado; trazo naranja antes del catálogo; apertura de la foto y giro de la gráfica de promociones; dígitos del countdown con recambio de 480 ms. Las entradas se ejecutan una vez por montaje, tienen contenido visible por defecto y cancelan WAAPI con movimiento reducido y al desmontar. No se añadieron partículas continuas, audio ni blur animado.
- **Temporadas:** cada entrada declara `serviceType`. Sólo `independence-day` y `new-years-eve` son `public`. Texas Independence Day, San Jacinto Day, Memorial Day y Diwali son `appointment`. El countdown selecciona exclusivamente la próxima temporada pública o el final de la pública activa. `isSeasonActive` reemplaza al ambiguo `isOpen`; nunca significa que el local esté abierto en ese instante. Los timers también se actualizan al límite exacto configurado y al recuperar visibilidad.
- Calendario, contacto, footer y referencias descriptivas de la web distinguen visitas coordinadas. Cuatro enlaces del calendario usan `tel:+12144713434`. Sin reservas automáticas ni nuevas funciones atribuidas a la app. Fechas y America/Chicago sin cambios.

## Preservación

SHA-256 de TODOS los recursos públicos que ya existían: sin cambios. Incluye los tres tamaños de Dallas, los tres de productos/plataforma y los mockups de la app. Dirección de Lavon, logo, sello, promociones, rutas legales, enlaces, App Store `id6793552663` y Android “Coming soon” conservados. El estado Git de `rockwall-fireworks-mobile` sigue igual al inicial (`?? app-store-assets/`); no se modificó ese proyecto.

## Validaciones

- `npm run lint`: OK, sin warnings.
- `npm run test`: **26/26 OK**. Cobertura de dos temporadas públicas, cuatro por cita, selección por tipo y no por título, límites exactos de junio/julio en CDT, diciembre/enero en CST, año anterior/siguiente, y configuraciones sin temporadas públicas. Tests del controlador verifican cero asignaciones de canvas/instancias en teléfono, tablet, ventana estrecha y movimiento reducido; transiciones, pausa preservada y limpieza. Se conservaron los tests del renderer que verifican RAF, observadores, listeners, visibilidad y callbacks tardíos.
- `npm run build`: OK. Bundle principal ~222 KB / 70.9 KB gzip, sin dependencias nuevas.
- `git diff --check`: OK.
- Chrome 152 en macOS, DPR 1, viewports **1440×1000, 1366×768, 768×1024, 390×844, 320×740 y 844×390**. Tamaños simulados, no dispositivos físicos.
- Anclas: About, Contact, catálogo, calendario, repetición del mismo enlace, retorno desde Mobile App y Terms & Conditions, cierre del menú, activación con Enter y foco en el título. Diferencias medidas sección/header entre -0.21 y +0.22 px (redondeo subpíxel). Header real ~114.4 px escritorio / 103 px móvil-tablet.
- A 1366×768: viewport útil ~653.6 px; hero ~653.8 px, About ~650.9 px, Contact ~623.5 px. Sin alturas fijas para contenido largo. A 768×1024 About ocupa ~690.5 px y entra completo.
- Hero a 390×844: modo `static`, **0 canvas**, 0 controles de pausa, SVG móvil elegido, sin overflow horizontal. Se comprobó cambio a escritorio y creación de canvas/control, pausa/resume real, y retorno a estático.
- Fixture local con políticas simuladas: tablet vertical y teléfono horizontal táctiles mantienen 0 canvas. El modo reducido elimina canvas/control y conserva el skyline y explosiones estáticas. Esta simulación controla las media queries de JavaScript; no cambia la preferencia nativa del sistema ni sustituye la verificación de sus media queries CSS.
- Reloj simulado en la aplicación real: 1 marzo 2026 → Texas Independence Day “By appointment”, countdown a Independence Day; 1 julio a las 3am Chicago → “Public season in progress” / “Public season ends in”, nunca “Open now”.
- Revisión visual de cielo, oclusión por edificios, plataforma completa, sello, legibilidad, entradas, contactos y calendario. Se corrigió el cruce de una explosión con el enlace móvil y el recorte de la explosión principal en tablet vertical.
- Sin overflow horizontal de documento en tamaños revisados. Sin errores o warnings de aplicación en los logs inspeccionados de preview y fixture.

## Medición de coste del cielo

Herramienta reproducible en `scripts/sky-audit/`: renderer y controlador reales, canvas visible de 1440×600, Chrome 152 en macOS, viewport 1440×1000, DPR 1, 8 procesadores lógicos reportados por el navegador, sin throttling. Medición de 10 segundos con `performance.now()`, conteo de RAF/dibujados y `PerformanceObserver` para long tasks. Incluye el coste de enviar comandos al canvas; **no mide GPU, rasterización, batería ni rendimiento de hardware móvil**. Aísla el cielo, no representa una auditoría Web Vitals de toda la página.

| Modo | RAF ejecutados | Dibujados | JS de callbacks | RAF pendientes al final |
|---|---:|---:|---:|---:|
| Animado | 601 | 226 | 581.5 ms | 1 |
| Estático, política táctil simulada | 0 | 0 | 0 ms | 0 |
| Estático, política reducida simulada | 0 | 0 | 0 ms | 0 |
| Pausa manual | 0 | 0 | 0 ms | 0 |
| Canvas fuera del viewport | 0 | 0 | 0 ms | 0 |

No se observaron long tasks durante estas muestras. Segunda muestra animada: 598 RAF, 224 dibujados, 558.9 ms; son muestras exploratorias, no una comparación estadística. Datos originales en `artifacts/current-adjustments/performance-*.json`.

La apertura de otra pestaña automatizada no produjo `visibilitychange` a `hidden` en este entorno. Esa muestra se guardó como segunda medición animada, **no** como validación de pausa en segundo plano. La limpieza y pausa por `document.visibilityState` sí están cubiertas por tests automatizados; resta comprobar el cambio nativo de pestaña en una sesión manual.

El sandbox no permitió iniciar un segundo servidor en 4174 (`EPERM`). Se utilizó el preview existente de 4173. La instrumentación se compiló temporalmente dentro de `dist/` y el build final la retiró. Sus scripts se conservan para repetirla localmente; no están importados por la aplicación.

## Pendientes reales / datos que requieren confirmación

1. Pruebas en iPhone/Android/tablets físicos, batería y GPU; preferencia de movimiento reducido activada desde el sistema operativo; pausa de pestaña en segundo plano mediante un cambio nativo. No se afirma haberlas realizado.
2. Discrepancia previa preservada: `siteConfig.openHoursText` publica **8am–12am**, mientras las aperturas públicas configuradas comienzan a las **09:00**. Diwali, por cita, conserva **10:00–21:59:59**. No se cambiaron esos valores ni se inventaron horarios. El calendario sigue las fechas/horas configuradas; los cierres conservan el instante exacto `23:59:59`.
3. Las fechas móviles configuradas, incluida Diwali, requieren confirmación anual según el README original. No se sustituyeron por fechas supuestas.

## Capturas

En `artifacts/current-adjustments/`: `hero-desktop.png`, `hero-laptop.png`, `hero-mobile.png`, `products-desktop.png`, `products-mobile.png`, `seasons-desktop.png`, `seasons-mobile.png`, `about-tablet.png`, `hero-tablet-simulated.png` (con la etiqueta de simulación visible).
