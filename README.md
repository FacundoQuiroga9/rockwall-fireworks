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

## Organización

- `src/pages/`: páginas de inicio y términos.
- `src/components/`: secciones y componentes de interfaz.
- `src/data/products.json`: catálogo estático, destacados y orden.
- `src/data/brands.json`: marcas que se muestran en la franja animada.
- `src/config/siteConfig.js`: navegación, contacto, promoción y SEO.
- `src/config/seasonalConfig.js`: temporadas y countdown.
- `src/styles/`: tokens, fuentes y estilos base.
- `public/images/`: imágenes responsive optimizadas.
- `tests/`: validaciones de datos, assets, temporadas y SEO con `node:test`.

## Actualizar contenido

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

## Despliegue

Se puede publicar el contenido de `dist/` en un hosting estático convencional.
Como el sitio usa `BrowserRouter`, el hosting debe devolver `index.html` para
la ruta `/terms-and-conditions` y otras navegaciones internas. No hace falta
SSR ni un servidor de aplicación.

La auditoría inicial, el plan y el resultado final están documentados en
`SITE_AUDIT.md`, `SITE_OPTIMIZATION_PLAN.md` y
`SITE_OPTIMIZATION_REPORT.md`.
