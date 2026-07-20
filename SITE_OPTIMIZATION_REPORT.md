# Informe final de optimización de Rockwall Fireworks

Fecha de cierre: 20 de julio de 2026

## Estado general

La auditoría y las siete fases del plan se completaron. El sitio continúa
siendo una aplicación estática React + Vite, conserva su contenido comercial,
paleta, tipografías, logo, productos e identidad gráfica, y no incorpora
backend, base de datos, autenticación, compra ni tecnología mobile.

El resultado queda listo para desarrollo, build y preview con los mismos
comandos esperados. También queda documentada la regla de fallback que el
hosting debe aplicar a las rutas de la SPA.

## Resultados medibles

### Build y tamaño del repositorio

| Indicador | Baseline | Final | Resultado |
| --- | ---: | ---: | ---: |
| Módulos transformados | 168 | 66 | -60.7% |
| JavaScript principal | 275.05 kB | 191.28 kB | -30.5% |
| JavaScript principal gzip | 82.65 kB | 62.21 kB | -24.7% |
| CSS principal | 27.43 kB | 20.13 kB | -26.6% |
| CSS principal gzip | 7.16 kB | 4.95 kB | -30.9% |
| Archivos de `public/` | 13,811,780 bytes | 5,618,390 bytes | -59.3% |
| Archivos de `src/` | 1,316,497 bytes | 117,445 bytes | -91.1% |
| Vulnerabilidades de producción | 5 altas | 0 | Resuelto |
| Vulnerabilidades totales de npm | 6 al control intermedio | 0 | Resuelto |

La ruta legal se separa en un chunk propio de 2.29 kB de JavaScript, 0.96 kB
gzip, y 1.00 kB de CSS, 0.41 kB gzip. No se añadió una dependencia para este
code splitting.

Los recursos más costosos del primer render se redujeron de forma específica:

- Fondo del hero: de 1,968,847 bytes a variantes WebP de 63,542, 165,726 y
  258,370 bytes.
- Poster promocional: de 3,180,108 bytes a variantes WebP de 47,728, 72,570 y
  186,046 bytes.
- Productos: variantes de 320, 480 y 640 px elegidas mediante `srcset`.
- Marcas: variantes de 160 px para mobile y archivos mayores únicamente cuando
  la densidad de pantalla lo requiere.
- Fuentes: Anton SC y Jura locales suman aproximadamente 38 kB y usan
  `font-display: swap`.

### Lighthouse final

Medición con Lighthouse 13.4.0 sobre `npm run preview`, con el build final:

| Perfil | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 90 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Métricas mobile:

- FCP: 1.5 s.
- LCP: 3.5 s.
- CLS: 0.001.
- Total Blocking Time: 0 ms.
- Speed Index: 1.5 s.
- Transferencia auditada: 520 KiB.

Métricas desktop:

- FCP: 0.4 s.
- LCP: 0.8 s.
- CLS: 0.001.
- Total Blocking Time: 0 ms.
- Speed Index: 0.4 s.
- Transferencia auditada: 761 KiB.

Estas son métricas de laboratorio local con throttling. El resultado público
también dependerá de CDN, compresión, cache, latencia y headers del hosting.

## Resumen de cambios

### Arquitectura y datos

- Se crearon páginas explícitas para home y Terms.
- Products y Brands se separaron de la presentación en JSON estático.
- Los diez productos reales tienen IDs únicos, categoría, estado destacado,
  orden y preview opcional.
- La navegación, contacto, promoción, redes, pagos y SEO se centralizaron en
  `siteConfig.js`.
- Las seis temporadas existentes se centralizaron en
  `seasonalConfig.js`, con zona horaria `America/Chicago`.
- La selección y orden de productos se movió a utilidades puras.
- El cálculo estacional ahora considera la zona horaria del negocio, el cambio
  de año, evita negativos y limpia su intervalo.
- Se agregó manejo defensivo para imágenes faltantes, categorías opcionales,
  productos sin video y listas vacías.
- Terms se carga de forma diferida porque es la única ruta secundaria y el
  límite de separación es claro.

### Dependencias y JavaScript

- Slick se reemplazó por un carrusel nativo con CSS scroll-snap.
- `react-scroll` se reemplazó por anchors, React Router y APIs del navegador.
- Ionicons y sus requests externos se reemplazaron por un componente SVG local.
- Se eliminaron datos hardcodeados, keys por índice, imports muertos y efectos
  innecesarios.
- No se aplicó memoización indiscriminada ni se agregó estado global.

### Imágenes, fuentes y assets

- Se convirtió y redimensionó el material existente sin cambiar su contenido.
- Hero, About y Contact usan `<picture>` y variantes responsive.
- El fondo LCP es descubrible desde el HTML, no usa lazy loading y es el único
  recurso con prioridad alta.
- Imágenes inferiores usan carga diferida, decodificación asíncrona y
  dimensiones o proporciones reservadas.
- Las tarjetas mantienen un frame cuadrado con `object-fit: contain`.
- Logo, promoción, marcas y productos tienen variantes adaptadas a su tamaño
  renderizado.
- Se self-hostearon Anton SC y Jura junto con sus licencias OFL.
- Se creó una imagen social real de 1200×630, favicon de 32 px y apple touch
  icon de 180 px.
- Se eliminaron originales pesados, duplicados binarios y assets sin
  referencias solo después de comprobar sus reemplazos.

### Responsive y sistema visual

- Se centralizaron colores, tipografías, espacios, contenedores, radios,
  sombras, transiciones, z-index y offset del header en variables CSS.
- Se reemplazaron alturas rígidas por contenido fluido, `clamp`, Grid, Flexbox,
  `aspect-ratio` y anchos máximos.
- Header, hero, productos, marcas, About, countdown, Contact, footer, popup y
  Terms se ajustaron para mobile, tablet, laptop y pantallas grandes.
- El menú mobile cambia según el espacio disponible, no según un ancho de
  dispositivo arbitrario.
- El popup limita altura, permite scroll interno y tiene una composición
  específica para landscape bajo.
- El carrusel de marcas conserva el movimiento de marca y presenta una versión
  estática útil con `prefers-reduced-motion`.
- Se resolvió el overflow real sin depender de recortar contenido importante.

### Accesibilidad y navegación

- Se agregaron `header`, `nav`, `main`, `footer`, un solo `h1` por ruta y una
  jerarquía coherente de headings.
- Se agregó enlace “Skip to main content” y foco visible global.
- El menú usa `button`, `aria-expanded`, `aria-controls`, bloqueo del fondo,
  foco inicial, ciclo de foco, cierre con Escape y retorno del foco.
- El menú se cierra al navegar y al cambiar a desktop.
- El popup usa `role="dialog"`, `aria-modal`, nombre y descripción accesibles,
  foco atrapado, Escape, backdrop seguro, bloqueo del fondo y retorno de foco.
- La promoción se recuerda solo durante la sesión y no agrega cookies.
- Los anchors reciben `scroll-margin-top` y el destino toma foco después de
  navegar.
- Links sociales, previews y controles tienen nombres accesibles.
- Todos los targets táctiles auditados alcanzan al menos 44 px.
- Se corrigió el contraste del botón Preview detectado por Lighthouse.
- Los movimientos y scroll suave respetan `prefers-reduced-motion`.

### SEO local

- Se agregaron title, description, canonical, robots, theme color, Open Graph y
  Twitter cards.
- Home y Terms actualizan title, description, canonical y metadata social por
  ruta.
- Se agregaron `robots.txt` y `sitemap.xml`.
- Se agregó JSON-LD de tipo `Store` con nombre, URL, descripción, imagen, logo,
  dirección, teléfono, email y redes reales.
- No se agregaron ratings, reviews, precios ni horarios estructurados
  incompletos.
- Se corrigieron favicon, apple touch icon, idioma y jerarquía indexable.

### Seguridad y privacidad

- Todos los links con `target="_blank"` incluyen
  `rel="noopener noreferrer"`.
- Se eliminaron scripts visuales, fuentes y estilos de terceros.
- No se agregaron trackers, analytics, cookies, embeds ni APIs.
- React Router, Vite y el plugin React recibieron actualizaciones acotadas y
  verificadas.
- `npm audit` y `npm audit --omit=dev` finalizan con cero vulnerabilidades.

## Archivos creados

Documentación y validación:

- `SITE_AUDIT.md`
- `SITE_OPTIMIZATION_PLAN.md`
- `SITE_OPTIMIZATION_REPORT.md`
- `scripts/visual-audit.mjs`
- `tests/content-data.test.js`

Datos, configuración y utilidades:

- `src/data/products.json`
- `src/data/brands.json`
- `src/config/siteConfig.js`
- `src/config/seasonalConfig.js`
- `src/utils/productData.js`
- `src/utils/seasonalCountdown.js`
- `src/hooks/usePageMetadata.js`

Páginas, componentes y estilos base:

- `src/pages/HomePage.jsx`
- `src/pages/TermsPage.jsx`
- `src/components/common/Icon.jsx`
- `src/components/productCarousel/ProductCard.jsx`
- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/assets/fonts/fonts.css`
- Dos WOFF2 y dos licencias OFL en `src/assets/fonts/`

SEO y assets:

- `public/robots.txt`
- `public/sitemap.xml`
- 72 imágenes optimizadas en `public/images/`, organizadas en `brands`,
  `hero`, `icons`, `payments`, `products`, `promotion`, `sections` y `social`.

## Archivos modificados

Configuración raíz:

- `.eslintrc.cjs`
- `.gitignore`
- `README.md`
- `index.html`
- `package.json`
- `package-lock.json`

Aplicación y componentes:

- `src/App.jsx`
- `src/main.jsx`
- Todos los JSX/CSS existentes de About, Brands, Contact, Countdown, Footer,
  Hero, Navbar, Popup, ProductCarousel, ScrollToTop y Terms.

## Archivos eliminados

Se eliminaron los CSS globales vacíos u obsoletos:

- `src/App.css`
- `src/index.css`

Se eliminaron los originales de raíz reemplazados o sin uso:

- `public/50-years-phrase.png`
- `public/action-zone.png`
- `public/alien-attack.png`
- `public/building.jpg`
- `public/crazy-phrase.png`
- `public/diablo.png`
- `public/favicon.png`
- `public/festival-balls.png`
- `public/festival-balls2.png`
- `public/festival-balls3.png`
- `public/fireworks-sample.png`
- `public/fireworks.jpg`
- `public/fondo.jpg`
- `public/futurama.png`
- `public/hero1.jpg`
- `public/logotipo.png`
- `public/neon-beef.png`
- `public/night-rider.png`
- `public/poster.png`
- `public/star-light.png`
- `public/the-reaper.png`

También se eliminó `src/images/` completo: trece logos y medios de pago
duplicados que ahora se sirven optimizados desde `public/images/`.

No se eliminó `public/rf coupons.pdf` porque contiene la oferta comercial real.

## Dependencias

Eliminadas:

- `bootstrap`
- `sass`
- `react-scroll`
- `react-slick`
- `slick-carousel`

Agregadas:

- Ninguna dependencia de runtime.
- Ninguna dependencia de desarrollo.

Actualizadas de forma acotada:

- `react-router-dom`: 6.26.2 → 6.30.4.
- `vite`: 5.3.1 → 6.4.3.
- `@vitejs/plugin-react`: 4.3.1 → 4.7.0.
- Se aplicaron parches transitivos seguros a seis paquetes del tooling mediante
  `npm audit fix`.

## Decisiones de arquitectura

- Se mantuvo JavaScript porque una migración a TypeScript no aportaba valor
  proporcional.
- Se conservaron CSS global base y CSS por componente; no se introdujo
  Tailwind, Sass, CSS-in-JS ni CSS Modules.
- Se mantuvo React Router y `BrowserRouter`; cambiar la estrategia de URLs
  habría afectado el despliegue y enlaces existentes.
- No se forzó una reorganización total de carpetas. Se agregaron únicamente
  `pages`, `data`, `config`, `utils`, `hooks`, `styles` y `common`, dejando las
  secciones reconocibles.
- Se usó estado local solo en menú, carrusel, popup e imagen fallback.
- El countdown y la preparación de productos se implementaron como funciones
  puras, por ser las áreas con valor real de prueba y posible reutilización.
- No se estructuraron horarios en JSON-LD porque el sitio solo proporciona
  “8am - 12am” sin días ni excepciones suficientes.

## Validaciones realizadas

| Validación | Resultado |
| --- | --- |
| `npm run dev` | Correcto; HMR activo |
| `npm run build` | Correcto; 66 módulos |
| `npm run preview` | Correcto; build servido localmente |
| `npm run lint` | Correcto; 0 warnings y 0 errores |
| `npm run test` | Correcto; 6/6 pruebas |
| `npm audit --omit=dev` | 0 vulnerabilidades |
| `npm audit` | 0 vulnerabilidades |
| `git diff --check` | Correcto |
| Home | Correcta |
| `/terms-and-conditions` | Correcta en 390 y 1440 px |
| Assets locales | Cero requests fallidos o respuestas de error |
| Consola | Cero excepciones |

La auditoría de producción cubrió 320, 375, 390, 430, 768, 1024, 1280, 1440
y 1920 px. En todos los anchos registró:

- Cero overflow horizontal real o elementos desbordados no intencionales.
- Cero imágenes sin atributo `alt`.
- Cero controles sin nombre accesible.
- Cero targets táctiles pequeños.
- Cero IDs duplicados.
- Cero requests fallidos, respuestas HTTP de error o excepciones.

También se verificó automáticamente:

- Menú mobile abierto/cerrado, ARIA, foco, Escape, `inert` y scroll lock.
- Popup abierto/cerrado, foco, Escape, `aria-modal`, `inert` y scroll lock.
- Canonical y metadata específica de Terms.
- Productos, categorías, IDs, imágenes y orden.
- Caso de New Year que cruza de diciembre a enero.
- Selección de próxima temporada sin valores negativos.
- JSON-LD válido, robots, sitemap y ausencia de datos estructurados ficticios.
- Links externos protegidos.

## Problemas no modificados y riesgos pendientes

- Las fechas estacionales se preservaron tal como estaban. Diwali y otras
  ventanas móviles deben confirmarse cada año; no se inventó una fecha 2026.
- “8am - 12am” no especifica días, temporada ni excepciones. Por eso no se
  añadió `OpeningHoursSpecification`.
- El PDF de cupones pesa 2,713,745 bytes y es el archivo público más pesado.
  Puede optimizarse manualmente después de verificar texto, impresión y
  calidad; no participa del render inicial.
- El contenido de Terms se preservó y no constituye una revisión legal.
- Debe confirmarse que el canonical público definitivo sea
  `https://www.rockwallfireworks.com`.
- El hosting real debe configurar fallback de SPA para visitas directas a
  `/terms-and-conditions`.
- La metadata específica de Terms se actualiza en cliente; si en el futuro se
  necesitan previews sociales distintos por ruta sin JavaScript, hará falta
  prerender estático o soporte del hosting.
- La promoción “50 years” es contenido real actual, pero debe retirarse o
  actualizarse cuando deje de corresponder.
- No se realizó una prueba con lectores de pantalla y dispositivos físicos. Se
  combinaron revisión semántica, teclado, Chrome y Lighthouse.
- No existen datos de campo de Core Web Vitals. Cache, compresión Brotli,
  HTTP/2/3 y CDN quedan bajo responsabilidad del hosting.

## Recomendaciones futuras

1. Confirmar las temporadas y horarios antes de cada período de venta.
2. Configurar cache prolongado para assets con hash y WebP en producción.
3. Validar el dominio público con Rich Results Test y Search Console después
   del despliegue.
4. Probar VoiceOver o NVDA en home, menú, carrusel, promoción y Terms.
5. Ejecutar Lighthouse sobre la URL pública y vigilar Core Web Vitals reales.
6. Optimizar el PDF de cupones con una revisión visual e impresión de prueba.
7. Agregar una prueba de despliegue para el fallback de
   `/terms-and-conditions` cuando se defina el proveedor de hosting.

## Pasos manuales de validación

1. Ejecutar `npm install`, `npm run lint`, `npm run test` y `npm run build`.
2. Ejecutar `npm run preview` y abrir home y `/terms-and-conditions`.
3. Recorrer Featured Products, About y Contact desde desktop y mobile.
4. Abrir el menú con teclado, recorrerlo con Tab y cerrarlo con Escape.
5. Esperar la promoción, recorrer cierre/CTA con Tab y cerrarla con Escape y
   haciendo clic fuera.
6. Probar controles y scroll táctil del carrusel, previews de YouTube y el PDF
   de ofertas.
7. Verificar dirección, teléfono, email, redes, horarios y temporada próxima.
8. Probar 200% de zoom, reduced motion y orientación landscape.
9. Confirmar la ruta legal pegando su URL directamente en el hosting.

## Limitaciones conocidas

- Lighthouse se ejecutó contra Vite Preview local, no contra el hosting final.
- El auditor visual usa Chrome headless; no sustituye una matriz completa de
  navegadores o dispositivos reales.
- Las imágenes optimizadas usan WebP por compatibilidad y tamaño. AVIF podría
  reducir algunos recursos, pero añadir otra matriz de variantes no mostró una
  necesidad proporcional para alcanzar los objetivos.
- El sitio sigue siendo una SPA informativa; no se añadió prerender, SSR ni
  lógica server-side.

## Future Mobile App Readiness

La tarea no crea una aplicación mobile ni agrega React Native, Expo, Capacitor
o Ionic. Sí deja fuentes conceptuales que pueden compartirse o transformarse
más adelante:

- `products.json` ofrece IDs/slugs estables, nombres, categorías, orden,
  destacados y preview opcional, separados de React DOM.
- Las dos variantes “Festival Balls” ya tienen identificadores inequívocos.
- Las categorías se derivan de los datos y no de markup visual.
- `brands.json` establece IDs y nombres consistentes.
- `siteConfig.js` centraliza identidad, navegación, contacto, dirección,
  teléfono, email, redes, promoción y medios de pago.
- `seasonalConfig.js` concentra temporadas y zona horaria; la lógica de
  countdown es una función JavaScript pura con pruebas.
- Los tokens CSS documentan colores, tipografías, espaciado, radios, sombras y
  transiciones que pueden traducirse a tokens nativos.
- Los assets se organizan por dominio y usan convenciones de nombre y tamaños
  previsibles.
- Las fuentes y licencias están locales y claramente identificadas.
- El contenido informativo está separado en secciones y páginas reconocibles.
- Las pruebas de datos fijan invariantes útiles para una futura capa compartida.

Los componentes JSX y el CSS actuales son específicos de web y no se presentan
como código directamente reutilizable en mobile. Las rutas `/images/...`
también requerirán un mapeo de assets o CDN en una app nativa. La preparación
real consiste en la separación de datos, convenciones, configuración y tokens,
sin introducir ahora una abstracción multiplataforma prematura.
