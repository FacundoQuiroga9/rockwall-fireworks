# Rockwall Fireworks

Sitio informativo estático de Rockwall Fireworks, construido con React 18 y
Vite. No utiliza backend, base de datos, autenticación ni flujo de compra.

## Desarrollo local

```bash
npm install
npm run dev
```

Comandos de validación:

```bash
npm run lint
npm run test
npm run build
npm run preview
```

`npm run build` genera el sitio estático en `dist/`.

### Simular el countdown en desarrollo

El debug está oculto por defecto, incluso en desarrollo, y el countdown usa la
hora real. Para activarlo, iniciá Vite con esta opción explícita:

```bash
VITE_COUNTDOWN_DEBUG=true npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
```

Abrí `http://127.0.0.1:5175/#seasons` y desplegá **Countdown debug**,
arriba del contador. Elegí fecha y hora (incluido el año) y usá **Apply & freeze**,
o elegí un año y un caso en **Configured season checks** y pulsá **Apply quick check**.
Los 26 accesos rápidos derivan de las fechas configuradas: antes, durante y después
de las seis temporadas, seis intervalos y los dos lados del cambio diciembre/enero.

El selector siempre interpreta la hora en **America/Chicago**. Rechaza horas
inexistentes al pasar a horario de verano; durante la hora repetida de otoño
permite elegir la primera o segunda ocurrencia. **Use real time**, o desmarcar
**Freeze simulated time**, restablece el reloj real inmediatamente. Plegar el
panel conserva la simulación y su indicador; recargar la página la descarta.

La fuente de tiempo sólo afecta al countdown; no modifica `Date` ni el reloj
del sistema. No se guardan fechas simuladas en storage ni se leen de la URL.
Vite elimina el panel y su CSS de producción mediante `import.meta.env.DEV`;
el reloj de producción rechaza la simulación aunque la opción sea `true`. Para
volver a ocultarlo, reiniciá Vite sin `VITE_COUNTDOWN_DEBUG=true` (y quitá esa
variable de `.env.local` si la agregaste allí). Sin la opción, tampoco se permite
simular el reloj en desarrollo. Ver `UNIFORM_PRODUCTS_CALENDAR_REPORT.md`.

## Organización

- `src/pages/`: inicio, catálogo, detalle de producto y páginas informativas.
- `src/components/`: secciones y componentes de interfaz.
- `src/data/products.json`: catálogo estático, destacados y orden.
- `src/data/brands.json`: marcas que se muestran en la franja animada.
- `src/config/siteConfig.js`: navegación, contacto, promoción y SEO.
- `src/config/seasonalConfig.js`: temporadas y countdown.
- `src/styles/`: tokens, fuentes y estilos base.
- `public/images/`: imágenes responsive optimizadas.
- `tests/`: validaciones de datos, assets, temporadas y SEO con `node:test`.

## Actualizar contenido

El catálogo completo vive en `/products`; cada producto tiene una ruta estable
`/products/:slug`. La home conserva diez Featured Products. Los favoritos web
son locales al navegador y no se sincronizan con la app.

`src/data/products.json` es la fuente maestra comercial para web y app. Después
de aprobar un cambio, ejecutar `npm run catalog:sync` y `npm run catalog:check`.
El control compara campos e imágenes por ID, no sólo cantidades. Ver la
[guía de mantenimiento](docs/catalog/README.md) y el
[informe de enriquecimiento y pendientes](docs/catalog/enrichment-2026-09/README.md).

Los productos deben conservar IDs únicos y rutas locales. Cada imagen de
producto usa variantes de 320, 480 y 640 px con esta convención:

```text
product-name-320.webp
product-name-480.webp
product-name.webp
```

Las marcas usan el archivo principal y una variante `-160.webp`. Los datos
comerciales reales se editan en `siteConfig.js`; las fechas estacionales se
editan únicamente en `seasonalConfig.js`. Las fechas móviles, como Diwali,
deben confirmarse antes de cada temporada.

Cada temporada declara `serviceType: 'public' | 'appointment'`. Sólo Independence
Day (julio) y New Year's Eve son públicas. El countdown selecciona la temporada
activa o la próxima cronológica entre las seis configuradas, independientemente
de su modalidad. El mensaje y el único CTA principal explican si se visita durante
la apertura regular o mediante una cita telefónica. El calendario inferior sólo
muestra nombre, modalidad de atención y fechas, en ese orden, además del
indicador de temporada activa o próxima. La modalidad reutiliza los mismos datos
que el bloque principal; el listado no contiene acciones.
Una temporada activa no representa un estado de apertura en tiempo real.
Ver `CATALOG_SEASONS_REPORT.md` para los cambios y validaciones del catálogo,
los botones y el countdown.

El cielo usa una composición SVG estática si el viewport mide hasta 700 px,
el puntero principal es táctil (`pointer: coarse`, incluidas tablets), o está
activo `prefers-reduced-motion`. En esos casos no se crea canvas ni motor de
partículas. Las ventanas grandes con puntero preciso conservan la animación.
Las composiciones para teléfono, tablet vertical y formato ancho reutilizan
la misma ciudad aprobada. Ver `CURRENT_ADJUSTMENTS_REPORT.md` para validación.

## Despliegue

Se puede publicar el contenido de `dist/` en un hosting estático convencional.
Como el sitio usa `BrowserRouter`, `public/.htaccess` configura el fallback a
`index.html` para Hostinger/LiteSpeed y evita errores 404 al visitar rutas
internas directamente. No hace falta SSR ni un servidor de aplicación.
El build también genera documentos en `dist/catalog-pages/` con los metadatos
propios de cada ruta del catálogo; las reglas de `.htaccess` los sirven sin
cambiar las URLs. Incluir el archivo oculto `.htaccess` al copiar el build.

La auditoría inicial, el plan y el resultado final están documentados en
`SITE_AUDIT.md`, `SITE_OPTIMIZATION_PLAN.md` y
`SITE_OPTIMIZATION_REPORT.md`.
