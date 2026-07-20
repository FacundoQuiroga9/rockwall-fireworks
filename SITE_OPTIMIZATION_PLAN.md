# Plan de optimización de Rockwall Fireworks

Este plan parte de la evidencia documentada en `SITE_AUDIT.md`. Mantiene React,
Vite, el contenido y la identidad visual. Las fases son pequeñas, ordenadas y
reversibles.

## Principios de implementación

1. No cambiar contenido comercial salvo correcciones inequívocas.
2. Mantener la estética azul marino, naranja, blanca y gráfica.
3. No agregar backend, e-commerce, autenticación, CMS ni framework mobile.
4. Preferir React, CSS y APIs nativas sobre dependencias nuevas.
5. Validar lint/build y el render local después de cada fase.
6. Conservar originales de assets hasta verificar sus reemplazos.
7. No corregir fechas móviles sin confirmación; centralizarlas y documentar el
   riesgo.

## Fase 1 — Correcciones críticas, seguridad y limpieza inicial

### Objetivo

Dejar una base sin errores de lint conocidos, links rotos, dependencias
claramente innecesarias ni vulnerabilidades de runtime corregibles de forma
segura.

### Problemas que resuelve

- Mailto mal escrito y targets `_blanck`.
- Import y comentarios muertos.
- Dependencias no usadas: Bootstrap y Sass.
- Dependencias evitables: react-scroll, react-slick y slick-carousel.
- React Router vulnerable.
- Vite vulnerable en desarrollo.
- Configuración de lint que oculta `_blank` inseguro.

### Archivos afectados

- `package.json`
- `package-lock.json`
- `.eslintrc.cjs`
- `src/App.jsx`
- Componentes que contienen links/imports problemáticos
- CSS/imports de Slick

### Cambios esperados

- Actualizar React Router a una versión corregida dentro de v6.
- Actualizar Vite/plugin React al par compatible validado.
- Eliminar paquetes no usados y preparar reemplazos nativos.
- Corregir links y errores simples de lint.

### Riesgos

- Vite 6 es un major update motivado por advisories; puede cambiar detalles de
  build/dev.
- Quitar Slick antes del reemplazo rompería productos, por lo que eliminación e
  implementación deben ocurrir en el mismo commit lógico.

### Validación

- `npm install`
- `npm run lint`
- `npm run build`
- `npm audit --omit=dev`
- Abrir `/` y `/terms-and-conditions`.

### Criterio de finalización

- Lint sin errores.
- Build exitoso.
- Cero vulnerabilidades conocidas en dependencias de producción o excepción
  documentada.
- Links críticos correctos.

## Fase 2 — Datos, configuración y modularización

### Objetivo

Separar contenido/datos de la presentación y dividir responsabilidades solo
donde aporta claridad.

### Problemas que resuelve

- Productos hardcodeados y sin IDs.
- Datos de contacto/temporada dispersos.
- Navbar y ProductCarousel con responsabilidades mezcladas.
- Duplicación de navegación y logos.
- Home sin componente de página/landmark claro.

### Archivos afectados

- Nuevos `src/data/products.json` y `src/data/brands.json`
- Nuevos `src/config/siteConfig.js` y `src/config/seasonalConfig.js`
- `src/App.jsx`
- `src/pages/HomePage.jsx`
- Componentes de navegación, productos, countdown, contacto y footer
- Pruebas ligeras de datos

### Cambios esperados

- Productos con IDs únicos, featured, previewVideo y sortOrder.
- Datos opcionales tratados defensivamente.
- `FeaturedProducts`, `ProductCard` y controles simples con responsabilidades
  claras.
- Navegación derivada de una sola lista.
- Información comercial consistente desde una única fuente.
- Tests con APIs nativas de Node.

### Riesgos

- Renombrar rutas de imágenes o propiedades puede ocultar productos si no se
  valida el JSON.
- Las dos variantes “Festival Balls” deben mantener sus nombres visibles
  actuales.

### Validación

- Test de IDs únicos, rutas, orden y campos requeridos.
- Comparación de los diez productos y links de video.
- Navegación home/terms.
- Lint y build.

### Criterio de finalización

- Ningún producto comercial hardcodeado en JSX.
- Todos los productos actuales visibles y ordenados.
- Configuración de sitio/temporada centralizada.
- Tests de datos pasando.

## Fase 3 — Imágenes, fuentes, assets y rendimiento

### Objetivo

Reducir bytes iniciales, trabajo de decodificación y dependencias externas sin
degradar la identidad visual.

### Problemas que resuelve

- LCP de 1.97 MB.
- PNG del hero y poster de 3.18 MB cada uno.
- Imágenes below-the-fold cargadas de inmediato.
- Productos/logos/pagos sobredimensionados.
- Falta de dimensiones y lazy loading.
- Google Fonts/Ionicons externos.
- Assets duplicados o muertos.

### Archivos afectados

- `public/images/**`
- `src/assets/fonts/**`
- `index.html`
- Hero, About, Contact, Brands, ProductCard, Popup y Footer
- CSS asociado

### Cambios esperados

- WebP responsive para hero y variantes optimizadas donde aporte.
- `<picture>`, `srcset`, `sizes`, dimensiones, `decoding` y loading correctos.
- Solo el recurso LCP con prioridad alta.
- Imágenes inferiores lazy-loaded.
- Anton SC/Jura locales con `font-display: swap`.
- Iconos locales o texto accesible; eliminación de unpkg.
- Eliminación confirmada de duplicados/assets sin uso.

### Riesgos

- Compresión con pérdida excesiva.
- Recortes distintos en hero/About/Contact.
- Cambios métricos de fuente si el subset no coincide.

### Validación

- Comparación visual lado a lado en mobile y desktop.
- Comprobar transparencia y nitidez.
- Revisar Network y LCP.
- Verificar que ninguna imagen responda 404.
- Comparar pesos de `public/`, build JS/CSS y carga inicial.

### Criterio de finalización

- Reducción material del peso inicial.
- LCP servido desde imagen optimizada y responsive.
- Cero imágenes críticas sin dimensiones reservadas.
- Sin scripts visuales de terceros.
- Identidad visual preservada.

## Fase 4 — Responsive y consistencia visual

### Objetivo

Hacer que cada sección sea intencional en mobile, tablet y desktop, sin alturas
rígidas ni contenido recortado.

### Problemas que resuelve

- Breakpoint tardío de navegación.
- Alturas `100vh - 157px`.
- Cards rígidas.
- Popup vulnerable en landscape.
- Track de marcas discontinuo.
- Tokens/espaciados inconsistentes.
- Overflow ocultado globalmente.

### Archivos afectados

- Tokens y base CSS
- CSS de Navbar, Hero, Brands, FeaturedProducts, About, Countdown, Contact,
  Popup, Footer y Terms

### Cambios esperados

- Contenedores fluidos, `clamp`, Grid/Flex, `minmax`, `aspect-ratio`.
- Header y navegación adaptados según contenido.
- Productos con scroll-snap/Grid y controles estables.
- Secciones con `min-height` solo cuando aporta, nunca corte de contenido.
- Carrusel de marcas fluido y versión reduced-motion correcta.
- Tokens centralizados para color, espaciado, tipografía, radius, sombra,
  transición y z-index.

### Riesgos

- Variar demasiado densidad/altura frente al diseño original.
- Scroll-snap inconsistente si los controles calculan mal el desplazamiento.

### Validación

- Capturas y métricas en 320, 375, 390, 430, 768, 1024, 1280, 1440 y 1920 px.
- Mobile landscape y zoom.
- Auditoría de `scrollWidth`.
- Comparar hero y secciones principales contra baseline.

### Criterio de finalización

- Sin overflow horizontal del documento.
- Sin contenido importante oculto o cortado.
- Todas las resoluciones objetivo visualmente coherentes.
- Reduced-motion conserva una composición útil.

## Fase 5 — Accesibilidad y navegación

### Objetivo

Alcanzar buenas prácticas WCAG 2.1 AA en semántica, teclado, foco y movimiento.

### Problemas que resuelve

- Falta de h1/main/header.
- Menú mobile sin ARIA/Escape/foco.
- Popup no accesible.
- Links sociales sin nombre.
- Controles anidados.
- Focus states y targets táctiles inconsistentes.
- Headings clonados por Slick.

### Archivos afectados

- Layout/Navbar
- Hero
- ProductCard/FeaturedProducts
- Popup
- Contact/Footer
- Base CSS

### Cambios esperados

- Landmarks y jerarquía de headings correcta.
- H1 textual accesible conservando el gráfico del hero.
- Menú con `aria-expanded`, `aria-controls`, Escape, cierre al navegar y bloqueo
  de scroll.
- Dialog con foco inicial, Escape, backdrop seguro y retorno de foco.
- Links/botones semánticos, nombres accesibles y targets de 44 px.
- Focus visible consistente y reduced-motion.

### Riesgos

- Focus trap demasiado agresivo.
- Bloqueo de scroll que no se limpia al cambiar de ruta/breakpoint.

### Validación

- Navegación completa solo con teclado.
- Inspección del árbol accesible.
- Abrir/cerrar menú y popup con Enter, Space y Escape.
- Verificar retorno de foco y scroll.
- Ejecutar auditoría automatizada disponible y revisión manual.

### Criterio de finalización

- Un solo h1 por página.
- Cero interactivos visibles sin nombre.
- Menú y dialog completamente operables por teclado.
- Foco visible y orden lógico.

## Fase 6 — SEO y metadata

### Objetivo

Preparar la SPA para indexación local coherente sin inventar datos comerciales.

### Problemas que resuelve

- OG image inexistente.
- Canonical/Twitter/theme/apple ausentes.
- Metadata compartida en Terms.
- Falta de sitemap, robots y JSON-LD.
- Keywords incoherentes con sitio informativo.

### Archivos afectados

- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`
- Assets sociales/favicon
- Componente/helper de metadata de ruta
- Configuración central del sitio

### Cambios esperados

- Metadata completa para home.
- Metadata específica para Terms en navegación cliente.
- Canonical consistente.
- OG/Twitter con imagen real.
- JSON-LD LocalBusiness con nombre, URL, dirección, teléfono, email y redes
  reales; sin ratings, precios u horarios inventados.
- Robots y sitemap.

### Riesgos

- Dominio canonical incorrecto si producción usa otra variante.
- Metadata de ruta en SPA depende de ejecución JS.

### Validación

- Inspección de `<head>` en ambas rutas.
- Validación sintáctica de JSON-LD/XML.
- Confirmar que todas las URLs de assets existen.
- Prueba de datos estructurados manual cuando haya acceso público.

### Criterio de finalización

- Metadata y JSON-LD sin información ficticia.
- OG image existente.
- Sitemap/robots accesibles.
- Jerarquía indexable y canonical definido.

## Fase 7 — Validación final, build y limpieza

### Objetivo

Demostrar que las mejoras no rompieron contenido, rutas ni despliegue estático y
cerrar la documentación.

### Problemas que resuelve

- Riesgo de assets/links faltantes.
- Regresiones responsive.
- Documentación desactualizada.
- Archivos muertos después del refactor.

### Archivos afectados

- Todo el proyecto según resultados.
- `README.md`
- `.gitignore`
- `SITE_OPTIMIZATION_REPORT.md`

### Cambios esperados

- Baseline “after” reproducible.
- Limpieza final de imports, CSS y assets confirmados.
- README útil con comandos y requisitos.
- Reporte de cambios, métricas, riesgos y pasos manuales.

### Validación

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run test`, si se agrega
- `npm audit --omit=dev`
- Chrome en todos los anchos objetivo
- Home y Terms
- Anchors, menú, popup, links externos, imágenes, productos y countdown
- Revisión de consola, requests fallidos y overflow

### Criterio de finalización

- Build, lint y tests exitosos.
- Sin errores de consola o assets 404.
- Sin overflow horizontal no intencional.
- Contenido/identidad visual preservados.
- `SITE_OPTIMIZATION_REPORT.md` completo con limitaciones y pendientes.

