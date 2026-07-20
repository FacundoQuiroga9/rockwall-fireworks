# Auditoría del sitio Rockwall Fireworks

Fecha de auditoría: 20 de julio de 2026

## Resumen ejecutivo

El repositorio contiene una SPA pequeña construida con React 18 y Vite 5. La
home se compone de secciones consecutivas y existe una segunda ruta para
Terms & Conditions. No hay backend, base de datos, formularios conectados,
autenticación ni lógica de compra.

La identidad visual está bien definida y debe conservarse: azul marino,
naranja, blanco, tipografía condensada, composiciones de producto y fondos de
fuegos artificiales. El problema principal no es el concepto visual sino su
implementación:

- Los productos están hardcodeados dentro del carrusel; no existe el JSON
  estático indicado por la arquitectura esperada.
- La home puede solicitar aproximadamente 6.50 MiB de imágenes únicas en su
  carga y otros 3.03 MiB cuando aparece el popup promocional.
- El JavaScript de producción pesa 275.05 kB, 82.65 kB gzip, e incluye
  dependencias evitables para scroll y carrusel.
- `npm run lint` falla con 10 errores y 1 warning.
- La navegación mobile, el popup y el carrusel tienen problemas importantes de
  semántica, teclado, foco y nombres accesibles.
- No hay `h1` en la home, canonical, Twitter cards, datos estructurados,
  sitemap ni robots.txt.
- El countdown repite fechas móviles como si fueran anuales, usa la zona
  horaria del visitante y puede quedar con valores negativos al cruzar un
  límite de temporada.
- `npm audit --omit=dev` reporta 5 vulnerabilidades altas. Dos ramas provienen
  de React Router desactualizado y tres quedan contabilizadas como producción
  porque `sass`, aunque no se usa, está declarado en `dependencies`.

El proyecto es recuperable sin reconstruirlo. La estrategia recomendada es
mantener React + Vite, extraer datos/configuración, reemplazar solamente las
dependencias evitables, optimizar los assets ya existentes y corregir
progresivamente responsive, accesibilidad y SEO.

## Alcance y evidencia utilizada

Se inspeccionaron todos los archivos versionados y ocultos relevantes,
incluyendo:

- `package.json`, lockfile, configuración de ESLint y Vite.
- Todos los componentes JSX y todos los archivos CSS.
- Todos los assets de `public/` y `src/images/`.
- Dimensiones, formato, transparencia, peso y hashes de imágenes.
- Imports y referencias a assets.
- Build y lint de baseline.
- Árbol de dependencias y auditoría de seguridad.
- Render local con Chrome headless en 320, 375, 390, 430, 768, 1024, 1280,
  1440 y 1920 px.
- DOM renderizado, headings, landmarks, IDs, imágenes, links, targets táctiles,
  requests fallidos y excepciones de consola.

El baseline reproducible se generó con `scripts/visual-audit.mjs`. Los
resultados locales se guardan en `artifacts/visual-audit/baseline.json`.

## Arquitectura actual

### Entrada y enrutamiento

- `src/main.jsx` monta `<App />` dentro de `React.StrictMode`.
- `src/App.jsx` usa `BrowserRouter`.
- La ruta `/` renderiza, en este orden:
  1. Hero
  2. Carrusel de marcas
  3. Carrusel de productos destacados
  4. About
  5. Countdown
  6. Contact
- `/terms-and-conditions` renderiza una página legal.
- Navbar, popup, scroll-to-top y footer se montan en todas las rutas.

La ruta secundaria depende de que el hosting redirija las rutas desconocidas a
`index.html`. El repositorio no documenta ni incluye la regla de fallback del
hosting, por lo que una visita directa a `/terms-and-conditions` puede producir
404 según el proveedor.

### Componentes

Los componentes son pequeños en cantidad y tamaño. No existe un monolito que
justifique una arquitectura compleja. Los problemas son de responsabilidades
mezcladas y duplicación:

- `Navbar.jsx` mezcla navegación, scroll, routing, estado mobile y animación.
  Duplica todo el markup de enlaces para desktop y mobile.
- `ProductCarousel.jsx` mezcla configuración del carrusel, datos comerciales,
  presentación y enlace de preview.
- `Countdown.jsx` mezcla calendario estacional, conversión de fechas, selección
  de temporada, timer y UI.
- `Contact.jsx` y `Footer.jsx` duplican o contradicen información comercial en
  distintos lugares.
- `Popup.jsx` controla temporizadores y presentación, pero no implementa el
  comportamiento accesible de un diálogo.

No se necesita Redux, Context, servicios, repositorios ni state management
global.

### Carga de productos

No existe ningún archivo JSON de productos. Los diez productos están definidos
en un array local dentro de `ProductCarousel.jsx`.

Problemas encontrados:

- No tienen `id`, `featured` ni `sortOrder`.
- Se usa el índice del array como `key`.
- El campo de video se llama `videoLink`, nombre acoplado a la UI actual.
- “Festival Balls” aparece dos veces con categorías e imágenes distintas y no
  hay identificadores que distingan las variantes.
- Las categorías no pueden generarse desde una fuente de datos central.
- Los destacados no se derivan de los datos.
- No hay manejo defensivo de productos inválidos ni fallback de imagen.
- Un producto sin video depende de una cadena vacía.
- Existe `festival-balls2.png`, pero ningún producto lo referencia.

La migración apropiada es un único `src/data/products.json`, manteniendo los
diez productos reales y agregando únicamente IDs, flags y orden necesarios.

### Estilos

La estrategia actual combina:

- Un reset global extenso en `src/index.css`.
- Variables globales mínimas.
- Un CSS global por componente.
- CSS de Slick importado desde `App.jsx`.

No se usa CSS Modules, Sass ni Bootstrap aunque ambos paquetes están instalados.
La estrategia por componente es suficiente y debe conservarse, complementada
con tokens globales y utilidades pequeñas.

Problemas del sistema de estilos:

- Variables usadas pero no definidas: `--red`, `--blanco`, `--negro`.
- Colores, radios, bordes, sombras, tiempos y tamaños se repiten como valores
  arbitrarios.
- `App.css` está vacío.
- El reset fuerza `width: 100%` y `object-fit: cover` sobre todas las imágenes,
  una regla demasiado amplia.
- El reset elimina estilos tipográficos de todos los headings sin establecer
  una escala global coherente.
- `body { max-width: 100vw; overflow-x: hidden; }` puede ocultar bugs de overflow
  en lugar de resolverlos.
- Hay `!important` innecesarios en navegación y párrafos.
- Hay selectores y clases muertos: `#brands`, `.dibujo`, `.navbar-toggler`,
  animación `slideUp` y reglas `.logos-slide` que no coinciden con
  `.logos-slider`.
- `cursor: hover` es un valor inválido.
- Se mezclan breakpoints mobile-first y desktop-first sin una escala común.
- Los estados `:focus-visible`, `:active` y disabled no están normalizados.

### Assets e imágenes

El repositorio contiene aproximadamente 13 MiB en `public/` y 1.3 MiB en
`src/`. Los principales hallazgos son:

| Asset | Dimensiones | Peso aprox. | Uso / problema |
| --- | ---: | ---: | --- |
| `fireworks-sample.png` | 2187×2008 | 3.18 MB | Hero, se muestra cerca de 300–400 px |
| `poster.png` | 942×1461 | 3.18 MB | Popup, carga después de 3 s |
| `hero1.jpg` | 3130×3130 | 1.97 MB | LCP como background CSS |
| `fireworks.jpg` | 3130×3130 | 1.97 MB | Duplicado binario exacto de `hero1.jpg`, sin uso |
| `building.jpg` | 1600×900 | 1.09 MB | Background de About, carga aunque esté below-the-fold |
| `fondo.jpg` | 1366×768 | 291 kB | Background de Contact |
| `favicon.png` | 2847×3200 | 175 kB | Dimensiones excesivas para favicon |
| `logotipo.png` | 2183×649 | 47 kB | Se renderiza a 180–280 px de ancho |
| `crazy-phrase.png` | 2418×1244 | 58 kB | Sin uso |
| `festival-balls2.png` | 1043×1043 | 173 kB | Sin uso |

Otros problemas:

- Los diez productos usan PNG de 1043×1043 aunque se muestran a 200 px.
- Casi ninguna imagen tiene atributos `width` y `height`.
- No hay `srcset`, `sizes`, `decoding="async"` ni estrategia consistente de
  lazy loading.
- Hero, About y Contact usan backgrounds CSS, lo que impide lazy loading y
  priorización declarativa.
- Logos de marcas y medios de pago se decodifican desde archivos mucho mayores
  que su tamaño visual.
- `visa.png`, por ejemplo, mide 2795×904 para mostrarse con 19 px de alto.
- El GIF de Brothers no aporta una animación necesaria en el uso observado.
- Las rutas están divididas entre `public/` y imports desde `src/images/` sin
  una convención clara.
- La home carga todas las imágenes de producto por la implementación de Slick.

Los assets pueden convertirse y redimensionarse localmente a WebP sin cambiar
su contenido visual. Deben conservarse originales solo mientras se valida la
equivalencia.

### Tipografías y recursos externos

- Anton SC y Jura se cargan desde Google Fonts.
- Existen dos preconnects, pero no hay fallback métrico ni self-hosting.
- Ionicons se carga desde unpkg mediante dos scripts globales y después solicita
  varios SVG individuales.

Riesgos:

- Dependencia de terceros para elementos visuales básicos.
- Más requests, puntos de fallo y exposición de IP a terceros.
- Posible FOIT/FOUT y cambios métricos por fuentes.
- Los iconos no reciben automáticamente nombres accesibles por usar custom
  elements.

La solución recomendada es conservar Anton SC/Jura, servir sus WOFF2
localmente y reemplazar Ionicons por SVG o texto accesible local.

## Baseline de calidad y build

### Build

`npm run build` finaliza correctamente:

- 168 módulos transformados.
- JS: 275.05 kB, 82.65 kB gzip.
- CSS: 27.43 kB, 7.16 kB gzip.
- Se incluyen assets auxiliares de Slick (`slick.svg`, `ajax-loader.gif` y
  `slick.woff`).

### Lint

`npm run lint` falla con 10 errores y 1 warning:

- Props sin validación en Countdown y Popup.
- Import `ScrollLink` sin uso.
- Dependencias incompletas en el efecto del countdown.
- Texto no escapado según la configuración de React.

### Tests

No existe script de test ni pruebas. Dado que los datos de producto y el
calendario se convertirán en fuentes centrales, aporta valor agregar pruebas
ligeras con `node:test` para validar IDs, rutas y estructura, sin instalar un
framework.

### Consola y requests

En la carga local inicial, Chrome no registró excepciones JavaScript, requests
fallidos ni respuestas HTTP 4xx/5xx. Esto no elimina los errores lógicos y de
accesibilidad descritos. El popup aparece después de la ventana inicial de
medición y debe validarse por separado.

## Rendimiento

### Cuellos de botella reales

1. Imágenes sobredimensionadas:
   - Aproximadamente 6.50 MiB de imágenes únicas asociadas a la home.
   - El popup añade aproximadamente 3.03 MiB después de 3 segundos.
   - Los backgrounds de secciones inferiores se solicitan desde CSS aun cuando
     todavía no son visibles.
2. Dependencias de runtime evitables:
   - `react-slick`, `slick-carousel` y `react-scroll`.
   - Ionicons desde unpkg.
3. Render duplicado:
   - El carrusel de marcas duplica manualmente veinte `<img>`.
   - Slick clona tarjetas, headings, links y botones para hacer loop infinito.
4. LCP:
   - Chrome identifica `hero1.jpg` como LCP.
   - Es un background de 1.97 MB sin `fetchpriority`, `srcset` ni tamaños
     responsive.
5. Layout shift potencial:
   - Imágenes sin dimensiones explícitas.
   - Fuentes externas.
   - El countdown empieza vacío y actualiza un segundo después.
6. CPU y movimiento:
   - Carrusel de marcas con animación continua.
   - Slick añade listeners, transformaciones y estado para una lista pequeña.

Las mediciones locales de FCP/LCP no representan una red real y no deben
interpretarse como puntuaciones Lighthouse. Sí confirman qué elemento es LCP y
qué recursos participan.

## Responsive y consistencia visual

El hero conserva impacto visual en desktop y el layout mobile básico funciona,
pero hay fragilidad entre breakpoints y en contenidos inferiores.

Problemas:

- Navbar cambia a mobile recién en 576 px; el contenido desktop queda muy justo
  en anchos intermedios.
- Se usa un offset fijo de 157 px para todos los anchors y resoluciones.
- About y Contact usan `height: calc(100vh - 157px)`. En pantallas bajas,
  landscape, zoom o texto ampliado pueden cortar contenido.
- El menú mobile fija `height: 60vh` y no gestiona viewport pequeño ni contenido
  largo.
- El body oculta overflow horizontal globalmente.
- Product cards tienen altura fija de 25 rem e imagen fija de 200 px.
- El carrusel genera elementos deliberadamente fuera del viewport; en el
  baseline el auditor encuentra al menos 30 por resolución antes de truncar la
  lista.
- El carrusel de marcas anima un track cuyo ancho no corresponde con el
  desplazamiento `translateX(-100%)`, por lo que puede producir un salto al
  reiniciar.
- La regla desktop de logos contiene un typo y no se aplica.
- Popup no limita su altura ni permite scroll interno; puede desbordarse en
  mobile landscape.
- Títulos del countdown pueden quedar apretados por line-height rígido.
- El footer usa bloques de `min-width: 250px`, que producen una columna larga en
  mobile y un reparto poco controlado en tamaños intermedios.

La validación debe repetirse en 320, 375, 390, 430, 768, 1024, 1280, 1440 y
1920 px después de cada fase visual.

## Navegación

Problemas funcionales y de mantenimiento:

- Links desktop y mobile están duplicados.
- Desktop y mobile usan el mismo `id="navbarNav"`, creando IDs duplicados.
- El botón hamburguesa no tiene nombre accesible, `aria-expanded` ni
  `aria-controls`.
- Escape no cierra el menú.
- No se bloquea el scroll de fondo.
- No se restaura o gestiona foco.
- `handleScroll()` llama a `openMenu()` incluso desde desktop y desde el logo,
  dejando estado oculto inconsistente.
- Los enlaces usan `href="#"` sin prevenir la navegación por defecto.
- `react-scroll` y un `setTimeout(300)` intentan sincronizar navegación y
  render; es una carrera frágil.
- El menú no se cierra de forma explícita al cambiar de ruta o breakpoint.
- El sticky header usa un z-index mágico y offsets hardcodeados.

## Accesibilidad

Problemas críticos:

- No existe `h1` en la home.
- No existe landmark `<main>` ni `<header>`.
- El hero comunica “Celebrating 50 Years” únicamente mediante imagen.
- Veinte logos renderizados en Brands no tienen `alt`.
- Menú mobile sin nombre ni estado ARIA.
- Popup sin `role="dialog"`, `aria-modal`, label, Escape, gestión/restauración
  de foco o bloqueo de scroll.
- Botón de cierre `×` sin `aria-label`.
- Links sociales son custom elements sin texto accesible.
- En productos se anida `<button>` dentro de `<a>`, HTML interactivo inválido.
- Slick crea controles y clones; varios targets quedan por debajo de 44 px y el
  orden de headings contiene tarjetas clonadas.
- No hay estilos globales consistentes de `:focus-visible`.
- Los nav links usan anchors como acciones JS con `href="#"`.
- El top bar usa iconos no ocultados de lectores de pantalla.
- Los textos alternativos “Product”, “Crazy Phrase” y “50 Years” no describen
  correctamente intención/contenido.
- Los iconos de medios de pago usan `alt=""`, razonable si son decorativos,
  pero el texto no enumera los métodos aceptados.
- La jerarquía salta de `h2` a `h4` en Contact y Footer.

El baseline del DOM registra 23 imágenes sin alt no vacío, tres elementos
interactivos sin nombre en mobile, dos en desktop y numerosos targets menores
de 44 px debido principalmente a Slick.

## Modal promocional

El popup actual:

- Se abre automáticamente en todas las rutas a los 3 segundos.
- Se cierra automáticamente 12 segundos después de aparecer.
- No recuerda si el usuario ya lo cerró durante la sesión.
- No cierra con Escape ni click en backdrop.
- No devuelve foco al elemento anterior.
- No mueve foco al diálogo.
- No bloquea scroll del documento.
- No tiene límite vertical seguro.
- Carga un PNG de 3.18 MB.

Debe conservarse la promoción, pero implementarse como diálogo accesible y con
asset optimizado.

## Countdown y contenido estacional

Las seis temporadas están hardcodeadas dentro del componente y se reconstruyen
en cada render:

- Texas Independence Day.
- San Jacinto Day.
- Memorial Day.
- Independence Day.
- Diwali.
- New Year's Eve.

Problemas:

- No hay fuente central de configuración.
- Fechas sin offset se interpretan en la zona horaria del dispositivo.
- Diwali es una fecha móvil, pero el código repite los mismos días/meses todos
  los años. No se puede corregir sin confirmación comercial.
- El 1 de enero no se detecta correctamente el rango iniciado el año anterior.
- El rango se calcula una sola vez al montar; al abrir/cerrar una temporada no
  se selecciona nuevamente.
- Puede mostrar valores negativos tras cruzar una fecha.
- Espera un segundo para pintar valores iniciales.
- Actualiza cada segundo aunque solo muestra minutos.
- El heading llama `toUpperCase()` sobre un string inicialmente vacío.
- No hay estrategia accesible para evitar anuncios cada segundo.

Las fechas actuales deben centralizarse sin inventar nuevas. La validez
comercial de las fechas de 2026 y futuras queda como verificación pendiente.

## SEO

Estado actual:

- `lang="en"` es correcto para el contenido visible.
- Existe title, description, robots y Open Graph básico.
- El favicon está enlazado con MIME de SVG aunque es PNG.

Problemas:

- No hay canonical.
- No hay Twitter cards.
- No hay `og:site_name` ni locale.
- `og:image` apunta a
  `https://www.rockwallfireworks.com/images/fireworks-banner.jpg`, archivo que
  no existe en el repositorio.
- No hay ancho/alto/alt de OG image.
- No hay theme-color ni Apple touch icon.
- No hay sitemap ni robots.txt físico.
- No hay JSON-LD.
- No hay `h1` en home.
- Terms & Conditions hereda title y descripción de la home.
- `keywords` incluye “buy fireworks online”, aunque el sitio es informativo y
  la tarea prohíbe convertirlo en e-commerce.
- Parte del mensaje principal está incrustada en una imagen.
- No se documenta el fallback de rutas para crawlers y visitas directas.

Se dispone en el código de nombre, URL, dirección, teléfono, email e Instagram/
Facebook. El JSON-LD debe usar solo esos campos. No hay horarios suficientemente
precisos por día/temporada, por lo que no deben añadirse
`OpeningHoursSpecification` hasta confirmación.

## Seguridad y privacidad

- No hay variables de entorno ni secretos expuestos.
- No hay formularios, cookies, analytics ni trackers propios.
- Google Fonts y unpkg reciben requests de los visitantes.
- Ionicons ejecuta scripts de terceros sin SRI y no es necesario.
- Dos links usan `target="_blanck"` por typo y no incluyen `rel`.
- Los demás links `_blank` principales sí usan `noopener noreferrer`.
- El PDF y videos de YouTube solo se cargan al hacer click.
- La dirección, teléfono y emails son datos comerciales intencionalmente
  públicos, no secretos.

`npm audit`:

- Auditoría completa: 18 paquetes vulnerables contabilizados
  (1 low, 7 moderate, 10 high).
- Producción según package.json actual: 5 high.
- React Router tiene versiones corregidas dentro de la rama 6.
- Sass no se usa y debe eliminarse, lo que quita `immutable`/`picomatch` de la
  clasificación de producción.
- Vite 5.3.3 tiene advisories de servidor de desarrollo. La primera versión
  verificada fuera de los rangos reportados es Vite 6.4.3; el cambio mayor es
  justificable por seguridad, pero debe validarse con build/dev/preview.
- ESLint 8 está en fin de vida. Sus riesgos son de tooling local; migrar a
  ESLint 9 no debe mezclarse con el refactor visual salvo que sea necesario para
  resolver vulnerabilidades restantes.

## Errores y malas prácticas puntuales

- Email visible: `contact@rockwallfireworks.com`.
- `mailto` real en Contact: `contact@rockwarllfireworks.com` (typo, enlace
  roto).
- Terms usa un tercer email: `info@rockwallfireworks.com`.
- `target="_blanck"` en Hero y Footer.
- Import `ScrollLink` no usado.
- Índices como keys en productos.
- Comentarios obsoletos que describen cambios ya realizados.
- Strings, estilos y datos comerciales dispersos.
- Nombre “Payments methods” gramaticalmente incorrecto.
- Horario “8am -12am” sin espacio ni contexto estacional.
- Año legal hardcodeado en Terms.
- `react/jsx-no-target-blank` está desactivado globalmente, ocultando un control
  útil.

## Código y assets muertos o innecesarios

Confirmados:

- `src/App.css` vacío.
- `bootstrap` no importado.
- `sass` no usado; no hay `.scss`.
- `ScrollLink` no usado.
- `public/fireworks.jpg`: duplicado exacto de `hero1.jpg`.
- `public/crazy-phrase.png`: no referenciado.
- `public/festival-balls2.png`: no referenciado.
- CSS muerto o con typo señalado en la sección de estilos.

Candidatos a reemplazo:

- `react-scroll`: reemplazable por anchors nativos y `scroll-margin-top`.
- `react-slick` + `slick-carousel`: reemplazables por scroll-snap/Grid y una
  pequeña mejora progresiva.
- Ionicons CDN: reemplazable por iconos locales.

## Riesgos técnicos y de regresión

1. La fecha/horario comercial real no puede deducirse del código.
2. Los nombres exactos de las variantes duplicadas “Festival Balls” requieren
   confirmación si se desea diferenciarlas visualmente; solo los IDs internos
   deben distinguirse por ahora.
3. El comportamiento del hosting para rutas SPA es desconocido.
4. La optimización con pérdida debe compararse visualmente antes de borrar
   originales.
5. El carrusel actual puede ser parte de la expectativa visual. Su reemplazo
   debe mantener navegación horizontal y densidad semejante.
6. Self-hosting de fonts requiere conservar archivos/licencias adecuados.
7. Lighthouse en localhost no reproduce CDN, cache headers, compresión del
   hosting ni latencia real.
8. La oferta PDF y el poster pueden cambiar estacionalmente; sus nombres y
   referencias deben centralizarse para facilitar recambio.

## Archivos que deberían reorganizarse

Reorganización proporcionada recomendada:

```text
src/
  assets/
    fonts/
  components/
    common/
    layout/
    navigation/
    products/
    sections/
  config/
    seasonalConfig.js
    siteConfig.js
  data/
    brands.json
    products.json
  hooks/
  pages/
  styles/
    tokens.css
    base.css
  utils/
  App.jsx
  main.jsx
```

No es necesario forzar más capas. Contact/About/Countdown pueden seguir siendo
componentes de sección; Terms puede convertirse en página; los estilos por
componente pueden mantenerse.

## Datos que deben centralizarse

- Productos, IDs, categoría, imagen, featured, preview y orden.
- Marcas y alt text.
- Dirección, teléfono, email, social links y URL oficial.
- Texto/nombre/ruta de la promoción y PDF.
- Temporadas, zona horaria y horarios del countdown.
- Links de navegación.
- Tokens visuales.
- Metadata reutilizable y JSON-LD.

## Mejoras recomendadas por prioridad

### Críticas

1. Corregir mailto, `_blank`, lint y HTML interactivo inválido.
2. Actualizar React Router dentro de v6 y eliminar dependencias sin uso.
3. Extraer productos a JSON con IDs únicos y validación.
4. Rehacer navegación mobile accesible y sin markup duplicado.
5. Convertir el popup en diálogo accesible.
6. Centralizar countdown y corregir zona horaria/transiciones sin inventar
   fechas.
7. Añadir `h1`, `<main>`, headings y nombres accesibles.
8. Optimizar el LCP y el PNG del hero; reservar dimensiones.
9. Corregir metadata rota y agregar canonical/JSON-LD/robots/sitemap.

### Importantes

1. Reemplazar Slick y react-scroll por APIs nativas.
2. Optimizar/lazy-load About, Contact, poster, productos, logos y pagos.
3. Centralizar tokens y limpiar CSS muerto/contradictorio.
4. Eliminar alturas rígidas y validar todos los anchos objetivo.
5. Self-host de Anton SC y Jura; eliminar Ionicons CDN.
6. Añadir estados vacíos/fallbacks y pruebas de datos.
7. Lazy-load de la ruta legal y metadata específica.
8. Documentar fallback SPA del hosting.

### Opcionales

1. Automatizar Lighthouse CI en una fase futura.
2. Añadir AVIF además de WebP si el pipeline de contenido lo soporta.
3. Generar previews/miniaturas específicas si crece el catálogo.
4. Añadir una página 404 diseñada cuando se confirme el hosting.
5. Migrar ESLint 8 a 9 en una tarea de tooling separada si las dependencias de
   desarrollo restantes lo justifican.

